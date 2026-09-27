import io
import tempfile
import unittest
from contextlib import redirect_stdout
from pathlib import Path
from unittest.mock import patch

import login


class LoginTests(unittest.TestCase):
    def test_permission_failure_before_credentials_or_instagram(self):
        with tempfile.TemporaryDirectory() as directory:
            with patch.object(login, "session_path", return_value=Path(directory) / "session.json"), \
                 patch.object(login.tempfile, "TemporaryFile", side_effect=PermissionError), \
                 patch.object(login, "Client") as client, \
                 patch("builtins.input") as prompt, redirect_stdout(io.StringIO()) as output:
                with self.assertRaises(SystemExit):
                    login.main()
                client.assert_not_called()
                prompt.assert_not_called()
                self.assertIn("local session folder", output.getvalue())

    def test_save_failure_is_not_reported_as_failed_instagram_login(self):
        with tempfile.TemporaryDirectory() as directory:
            with patch.object(login, "session_path", return_value=Path(directory) / "session.json"), \
                 patch.object(login, "Client") as client, \
                 patch("builtins.input", return_value="example"), \
                 patch.object(login.getpass, "getpass", side_effect=["test-password", ""]), \
                 redirect_stdout(io.StringIO()) as output:
                client.return_value.dump_settings.side_effect = PermissionError
                with self.assertRaises(SystemExit):
                    login.main()
                self.assertIn("session locally", output.getvalue())
                self.assertNotIn("Login failed", output.getvalue())
                self.assertNotIn("test-password", output.getvalue())

    def test_success_saves_session(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "session.json"
            with patch.object(login, "session_path", return_value=path), \
                 patch.object(login, "Client") as client, \
                 patch("builtins.input", return_value="example"), \
                 patch.object(login.getpass, "getpass", side_effect=["test-password", ""]), \
                 redirect_stdout(io.StringIO()) as output:
                client.return_value.dump_settings.side_effect = lambda target: target.write_text("{}")
                login.main()
                self.assertTrue(path.is_file())
                self.assertFalse(path.with_suffix(".tmp").exists())
                self.assertIn("Session saved", output.getvalue())


if __name__ == "__main__":
    unittest.main()
