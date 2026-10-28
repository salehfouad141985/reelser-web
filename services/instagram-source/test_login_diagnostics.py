import json
import unittest
from types import SimpleNamespace

from login_diagnostics import failure_report


class DiagnosticTests(unittest.TestCase):
    def test_unknown_error_does_not_export_sensitive_response_fields(self):
        secret = "private-cookie-password-email@example.com"
        client = SimpleNamespace(
            last_json={"message": secret, "error_type": secret, "sessionid": secret,
                       "challenge": {"url": secret}, "two_factor_info": {"phone": secret}},
            last_response=SimpleNamespace(status_code=400, url="https://i.instagram.com/api/v1/accounts/login/?token=" + secret),
        )
        result = failure_report(client, SimpleNamespace(message=secret))
        self.assertNotIn(secret, json.dumps(result))
        self.assertEqual(result["http_status"], 400)
        self.assertEqual(result["endpoint"], "password_login")
        self.assertTrue(result["verification_requested"])

    def test_maps_account_error_without_copying_username(self):
        client = SimpleNamespace(last_json={"message": "We couldn't find an account with the username private-name"}, last_response=None)
        result = failure_report(client, Exception())
        self.assertEqual(result["response_category"], "account_not_found")
        self.assertNotIn("private-name", json.dumps(result))

    def test_empty_network_response(self):
        result = failure_report(SimpleNamespace(last_json=None, last_response=None), Exception())
        self.assertIsNone(result["http_status"])
        self.assertEqual(result["response_category"], "unavailable")


if __name__ == "__main__":
    unittest.main()
