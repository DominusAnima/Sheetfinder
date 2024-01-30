import Button from "../Components/Button";
import { loginGoogle } from "../firebase";

export function LoginPage() {
  return <Button onClick={() => loginGoogle()}>Sign in</Button>;
}
