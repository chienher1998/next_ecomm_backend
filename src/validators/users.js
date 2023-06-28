export function validateUser(input) {
  const validationErrors = {};

  if (!("name" in input) || input["name"].length == 0) {
    validationErrors["name"] = "Name cannot be blank";
  }

  if (!("email" in input) || input["email"].length == 0) {
    validationErrors["email"] = "Email cannot be blank";
  }

  if (!("password" in input) || input["password"].length == 0) {
    validationErrors["password"] = "Password cannot be blank";
  }

  if ("password" in input && input["password"].length < 8) {
    validationErrors["password"] = "Password should be at least 8 characters";
  }

  if (
    "email" in input &&
    !input["email"].match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
  ) {
    validationErrors["email"] = "Email is invalid";
  }

  return validationErrors;
}
