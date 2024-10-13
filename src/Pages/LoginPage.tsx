import { useState } from "react";
import Button from "../Components/Button";
import Field from "../Components/Field";
import Input from "../Components/Input";
import { login, register } from "../firebase";
// import { loginGoogle } from "../firebase";

export function LoginPage({
  userIdSetter,
}: {
  userIdSetter: React.Dispatch<React.SetStateAction<string | undefined>>;
}) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  return (
    <Field className="text-center mb-4" label="A Pathfinder 1e digital character sheet prototype">
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "center" }}>
        {/* <Button onClick={() => loginGoogle()}>Sign in</Button> */}
        <Input style={{ width: "50%" }} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <Input
          style={{ width: "50%" }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
        />
        <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
          <Button
            onClick={() => {
              login(email, password)
                .then((userId) => {
                  userIdSetter(userId);
                })
                .catch((error) => {
                  if (error.message === "404") {
                    alert("User not found. Would you like to create an account?");
                  } else if (error.message === "401") {
                    alert("Incorrect password.");
                  } else {
                    console.error(error);
                  }
                });
            }}
          >
            Sign in
          </Button>
          <Button
            onClick={() => {
              register(email, password)
                .then((userId) => {
                  userIdSetter(userId);
                })
                .catch(() => {
                  alert("Failed to register");
                });
            }}
          >
            Register
          </Button>
        </div>
      </div>
    </Field>
  );
}
