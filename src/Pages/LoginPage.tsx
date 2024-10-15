import { useState } from "react";
import Button from "../Components/Button";
import Field from "../Components/Field";
import Input from "../Components/Input";
import { login, register } from "../firebase/firebase";
import Toast from "../Components/Toast";

export function LoginPage({
  userIdSetter,
}: {
  userIdSetter: React.Dispatch<React.SetStateAction<string | undefined>>;
}) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [waiting, setWaiting] = useState<boolean>(false);
  const [toastContent, setToastContent] = useState<{ type: "success" | "error" | "info"; message: string } | undefined>(
    undefined
  );

  function handleSignIn() {
    setToastContent({ type: "info", message: "Trying to sign in" });
    setWaiting(true);
    login(email, password)
      .then((userId) => {
        userIdSetter(userId);
        setToastContent(undefined);
        setWaiting(false);
      })
      .catch((error) => {
        if (error.message === "404") {
          setToastContent({ type: "error", message: "User not found. Would you like to create an account?" });
        } else if (error.message === "401") {
          setToastContent({ type: "error", message: "Incorrect password" });
        } else {
          setToastContent({ type: "error", message: "Failed to sign in" });
        }
        setWaiting(false);
      });
  }

  function handleRegister() {
    setToastContent({ type: "info", message: "Trying to register" });
    setWaiting(true);
    register(email, password)
      .then((userId) => {
        setWaiting(false);
        setToastContent(undefined);
        userIdSetter(userId);
      })
      .catch((error) => {
        if (error.message === "409") {
          setToastContent({ type: "error", message: "User already exists" });
        } else {
          setToastContent({ type: "error", message: "Failed to register" });
        }
        setWaiting(false);
      });
  }

  return (
    <Field className="text-center mb-4" label="A Pathfinder 1e digital character sheet prototype">
      {toastContent && (
        <Toast
          type={toastContent.type}
          message={toastContent.message}
          duration={5000}
          onClose={() => {
            setToastContent(undefined);
          }}
        />
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "center" }}>
        <Input
          style={{ width: "50%" }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          disabled={waiting}
        />
        <Input
          style={{ width: "50%" }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          disabled={waiting}
        />
        <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
          <Button onClick={handleSignIn} disabled={waiting}>
            Sign in
          </Button>
          <Button onClick={handleRegister} disabled={waiting}>
            Register
          </Button>
        </div>
      </div>
    </Field>
  );
}
