"""Run interactively on the source host; credentials never enter the web application."""
import getpass
import os
import tempfile
from instagrapi import Client
from source import session_path


def main():
    os.umask(0o077)
    path = session_path()
    try:
        path.parent.mkdir(parents=True, exist_ok=True)
        # Check local storage before asking for credentials or contacting Instagram.
        with tempfile.TemporaryFile(dir=path.parent) as probe:
            probe.write(b"session-write-check")
            probe.flush()
        client = Client(session_retry_total=0)
        if path.exists():
            client.load_settings(path)
    except OSError:
        print("Cannot access the local session folder. Check its permissions for your Windows/service user, then retry.")
        raise SystemExit(1) from None
    username = input("Instagram username: ").strip()
    password = getpass.getpass("Instagram password: ")
    verification = getpass.getpass("2FA code (leave empty if not enabled): ").strip()
    try:
        if not client.login(username, password, verification_code=verification):
            raise RuntimeError("Login failed")
    except Exception as exc:
        print(f"Login failed ({type(exc).__name__}). Check Instagram and try again manually.")
        raise SystemExit(1) from None
    try:
        path.parent.mkdir(parents=True, exist_ok=True)
        temporary = path.with_suffix(".tmp")
        client.dump_settings(temporary)
        temporary.chmod(0o600)
        temporary.replace(path)
        print("Session saved. Restart the source service to use it.")
    except OSError:
        print("Could not save the Instagram session locally. Check session folder permissions and disk space, then retry.")
        raise SystemExit(1) from None
    except Exception as exc:
        print(f"Could not save session ({type(exc).__name__}).")
        raise SystemExit(1) from None


if __name__ == "__main__":
    main()
