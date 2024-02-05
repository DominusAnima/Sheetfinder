import Button from "../Components/Button";
import Field from "../Components/Field";
import { loginGoogle } from "../firebase";

export function LoginPage() {
  return (
    <Field className="text-center mb-4" label="A Pathfinder 1e digital character sheet prototype">
      <Button onClick={() => loginGoogle()}>Sign in</Button>
    </Field>
  );
}
