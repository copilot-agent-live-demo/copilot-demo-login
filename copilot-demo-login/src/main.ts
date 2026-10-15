import { login } from "./api/authClient";
import { createLoginForm } from "./LoginForm";

createLoginForm(document.querySelector<HTMLElement>("#app")!, login);
