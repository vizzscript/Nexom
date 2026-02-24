#!/usr/bin/env bash
set -euo pipefail

# Nexom API security smoke tests
# Usage:
#   USER_TOKEN="..." USER_SUBJECT="..." ./scripts/api-security-smoke-tests.sh
#
# Optional:
#   ADMIN_TOKEN="..." USER2_TOKEN="..." USER2_SUBJECT="..." EXPIRED_TOKEN="..." \
#   RUN_MUTATION=1 BOOKING_INTERNAL_TOKEN="..." ./scripts/api-security-smoke-tests.sh

AUTH_URL="${AUTH_URL:-http://localhost:8081/api/v1/auth}"
CATALOG_URL="${CATALOG_URL:-http://localhost:8082/api/v1}"
CONTACT_URL="${CONTACT_URL:-http://localhost:8083/api/v1/contact}"
PAYMENT_URL="${PAYMENT_URL:-http://localhost:8084/api/v1/payments}"
BOOKING_URL="${BOOKING_URL:-http://localhost:8085/api/v1/bookings}"

USER_TOKEN="${USER_TOKEN:-}"
ADMIN_TOKEN="${ADMIN_TOKEN:-}"
USER_SUBJECT="${USER_SUBJECT:-}"
USER2_TOKEN="${USER2_TOKEN:-}"
USER2_SUBJECT="${USER2_SUBJECT:-}"
EXPIRED_TOKEN="${EXPIRED_TOKEN:-}"
BOOKING_INTERNAL_TOKEN="${BOOKING_INTERNAL_TOKEN:-}"
RUN_MUTATION="${RUN_MUTATION:-0}"

if ! command -v curl >/dev/null 2>&1; then
  echo "curl is required."
  exit 1
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "jq is required for parsing JSON in this script."
  exit 1
fi

if [[ -z "$USER_TOKEN" ]]; then
  echo "Set USER_TOKEN first."
  echo "Example: USER_TOKEN='eyJ...' USER_SUBJECT='firebase_uid_or_user_id' ./scripts/api-security-smoke-tests.sh"
  exit 1
fi

if [[ -z "$USER_SUBJECT" ]]; then
  echo "Set USER_SUBJECT (should match token subject used by booking service)."
  exit 1
fi

PASS=0
FAIL=0
LAST_BODY=""

run_test() {
  local name="$1"
  local expected_code="$2"
  shift 2

  local body_file
  body_file="$(mktemp)"
  local code
  code="$(curl -sS -o "$body_file" -w "%{http_code}" "$@")"
  LAST_BODY="$(cat "$body_file")"
  rm -f "$body_file"

  if [[ "$code" == "$expected_code" ]]; then
    PASS=$((PASS + 1))
    echo "[PASS] $name -> $code"
  else
    FAIL=$((FAIL + 1))
    echo "[FAIL] $name -> got $code, expected $expected_code"
    echo "       response: $LAST_BODY"
  fi
}

create_booking_for_user() {
  local token="$1"
  local suffix="$2"
  local body_file
  body_file="$(mktemp)"
  local code
  code="$(curl -sS -o "$body_file" -w "%{http_code}" \
    -X POST "$BOOKING_URL" \
    -H "Authorization: Bearer $token" \
    -H "Content-Type: application/json" \
    -d "{\"serviceId\":\"svc_smoke_$suffix\",\"service\":{\"title\":\"Smoke Clean $suffix\",\"price\":999},\"date\":\"Mar 08\",\"time\":\"11:00 AM\",\"details\":{\"address\":\"Smoke Street $suffix\",\"phone\":\"9999999999\"}}")"

  if [[ "$code" != "201" ]]; then
    echo ""
    rm -f "$body_file"
    return 1
  fi

  local id
  id="$(jq -r '.data.id // empty' "$body_file")"
  rm -f "$body_file"
  echo "$id"
}

create_message_for_user() {
  local token="$1"
  local suffix="$2"
  local body_file
  body_file="$(mktemp)"
  local code
  code="$(curl -sS -o "$body_file" -w "%{http_code}" \
    -X POST "$CONTACT_URL/submit" \
    -H "Authorization: Bearer $token" \
    -H "Content-Type: application/json" \
    -d "{\"firstName\":\"Smoke$suffix\",\"lastName\":\"Test\",\"email\":\"smoke$suffix@example.com\",\"phone\":\"9999999999\",\"subject\":\"General Inquiry\",\"message\":\"ownership test $suffix\"}")"

  if [[ "$code" != "200" ]]; then
    echo ""
    rm -f "$body_file"
    return 1
  fi

  local id
  id="$(jq -r '.notification.referenceId // empty' "$body_file")"
  rm -f "$body_file"
  echo "$id"
}

echo "== Base URL config =="
echo "AUTH_URL=$AUTH_URL"
echo "CATALOG_URL=$CATALOG_URL"
echo "CONTACT_URL=$CONTACT_URL"
echo "PAYMENT_URL=$PAYMENT_URL"
echo "BOOKING_URL=$BOOKING_URL"
echo

echo "== Phase 1: Authz hardening checks (no token should fail) =="
run_test "Booking create requires auth" 401 \
  -X POST "$BOOKING_URL" \
  -H "Content-Type: application/json" \
  -d '{"serviceId":"x","service":{"title":"x","price":1},"date":"Mar 05","time":"10:00 AM","details":{"address":"a","phone":"1"}}'

run_test "Contact messages requires auth" 401 \
  -X GET "$CONTACT_URL/messages"

run_test "Catalog category create requires auth" 401 \
  -X POST "$CATALOG_URL/categories" \
  -H "Content-Type: application/json" \
  -d '{"name":"Unauthorized Category"}'

echo
echo "== Phase 2: User token checks =="
run_test "Catalog read categories is public" 200 \
  -X GET "$CATALOG_URL/categories"

run_test "Catalog write denied for non-admin" 403 \
  -X POST "$CATALOG_URL/categories" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"UserShouldNotCreate"}'

run_test "Contact submit works with user token" 200 \
  -X POST "$CONTACT_URL/submit" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Smoke","lastName":"Test","email":"smoke@example.com","phone":"9999999999","subject":"General Inquiry","message":"security smoke test"}'

run_test "Contact fetch works with user token (scoped)" 200 \
  -X GET "$CONTACT_URL/messages" \
  -H "Authorization: Bearer $USER_TOKEN"

run_test "Booking list for own subject" 200 \
  -X GET "$BOOKING_URL/user/$USER_SUBJECT" \
  -H "Authorization: Bearer $USER_TOKEN"

run_test "Booking list rejects malformed token" 401 \
  -X GET "$BOOKING_URL/user/$USER_SUBJECT" \
  -H "Authorization: Bearer not-a-jwt"

if [[ -n "$EXPIRED_TOKEN" ]]; then
  run_test "Booking list rejects expired token" 401 \
    -X GET "$BOOKING_URL/user/$USER_SUBJECT" \
    -H "Authorization: Bearer $EXPIRED_TOKEN"
else
  echo "EXPIRED_TOKEN not set: expired-token check skipped."
fi

run_test "Booking internal endpoint rejects missing internal token" 401 \
  -X PATCH "$BOOKING_URL/internal/000000000000000000000000/status" \
  -H "Content-Type: application/json" \
  -d '{"status":"Paid"}'

run_test "Booking internal endpoint rejects wrong internal token" 401 \
  -X PATCH "$BOOKING_URL/internal/000000000000000000000000/status" \
  -H "x-internal-token: wrong-token" \
  -H "Content-Type: application/json" \
  -d '{"status":"Paid"}'

if [[ -n "$BOOKING_INTERNAL_TOKEN" ]]; then
  run_test "Booking internal endpoint rejects invalid status" 400 \
    -X PATCH "$BOOKING_URL/internal/000000000000000000000000/status" \
    -H "x-internal-token: $BOOKING_INTERNAL_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"status":"NOT_A_VALID_STATUS"}'
else
  echo "BOOKING_INTERNAL_TOKEN not set: invalid-status check skipped."
fi

if [[ -n "$USER2_TOKEN" && -n "$USER2_SUBJECT" ]]; then
  echo
  echo "== Phase 2b: Cross-user IDOR/ownership checks =="

  booking_id_for_user1="$(create_booking_for_user "$USER_TOKEN" "idor1")"
  if [[ -n "$booking_id_for_user1" ]]; then
    run_test "User2 cannot get User1 booking by ID" 403 \
      -X GET "$BOOKING_URL/$booking_id_for_user1" \
      -H "Authorization: Bearer $USER2_TOKEN"

    run_test "User2 cannot patch User1 booking" 403 \
      -X PATCH "$BOOKING_URL/$booking_id_for_user1" \
      -H "Authorization: Bearer $USER2_TOKEN" \
      -H "Content-Type: application/json" \
      -d '{"time":"04:00 PM"}'

    run_test "User2 cannot cancel User1 booking" 403 \
      -X PATCH "$BOOKING_URL/$booking_id_for_user1/cancel" \
      -H "Authorization: Bearer $USER2_TOKEN"
  else
    FAIL=$((FAIL + 1))
    echo "[FAIL] Could not create User1 booking for IDOR checks."
  fi

  message_id_for_user1="$(create_message_for_user "$USER_TOKEN" "idor1")"
  if [[ -n "$message_id_for_user1" ]]; then
    run_test "User2 cannot mark User1 message as read" 403 \
      -X PATCH "$CONTACT_URL/messages/$message_id_for_user1/read" \
      -H "Authorization: Bearer $USER2_TOKEN"

    run_test "User2 cannot delete User1 message" 403 \
      -X DELETE "$CONTACT_URL/messages/$message_id_for_user1" \
      -H "Authorization: Bearer $USER2_TOKEN"
  else
    FAIL=$((FAIL + 1))
    echo "[FAIL] Could not create User1 message for ownership checks."
  fi
else
  echo
  echo "USER2_TOKEN/USER2_SUBJECT not set: cross-user IDOR checks skipped."
fi

if [[ "$RUN_MUTATION" == "1" ]]; then
  echo
  echo "== Phase 3: Optional mutation flow =="
  if [[ -z "$BOOKING_INTERNAL_TOKEN" ]]; then
    echo "RUN_MUTATION=1 requires BOOKING_INTERNAL_TOKEN; skipping mutation flow."
  else
    run_test "Create booking with user token" 201 \
      -X POST "$BOOKING_URL" \
      -H "Authorization: Bearer $USER_TOKEN" \
      -H "Content-Type: application/json" \
      -d '{"serviceId":"svc_smoke","service":{"title":"Smoke Clean","price":999},"date":"Mar 08","time":"11:00 AM","details":{"address":"Smoke Street 1","phone":"9999999999"}}'

    booking_id="$(echo "$LAST_BODY" | jq -r '.data.id // empty')"
    if [[ -n "$booking_id" ]]; then
      run_test "Internal booking status update with shared token" 200 \
        -X PATCH "$BOOKING_URL/internal/$booking_id/status" \
        -H "x-internal-token: $BOOKING_INTERNAL_TOKEN" \
        -H "Content-Type: application/json" \
        -d '{"status":"Pending Payment"}'

      run_test "Cancel booking as owner" 200 \
        -X PATCH "$BOOKING_URL/$booking_id/cancel" \
        -H "Authorization: Bearer $USER_TOKEN"
    else
      FAIL=$((FAIL + 1))
      echo "[FAIL] Could not parse booking_id from create booking response."
    fi
  fi
fi

if [[ -n "$ADMIN_TOKEN" ]]; then
  echo
  echo "== Phase 4: Optional admin checks =="
  category_name="SmokeAdminCategory_$(date +%s)"
  run_test "Admin can create category" 201 \
    -X POST "$CATALOG_URL/categories" \
    -H "Authorization: Bearer $ADMIN_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"name\":\"$category_name\"}"

  run_test "Admin can read contact messages" 200 \
    -X GET "$CONTACT_URL/messages" \
    -H "Authorization: Bearer $ADMIN_TOKEN"

  if [[ -n "$USER2_SUBJECT" ]]; then
    run_test "Admin can read User2 bookings" 200 \
      -X GET "$BOOKING_URL/user/$USER2_SUBJECT" \
      -H "Authorization: Bearer $ADMIN_TOKEN"
  fi
else
  echo
  echo "ADMIN_TOKEN not set: admin checks skipped."
fi

echo
echo "== Summary =="
echo "PASS=$PASS FAIL=$FAIL"
if [[ "$FAIL" -gt 0 ]]; then
  exit 1
fi
