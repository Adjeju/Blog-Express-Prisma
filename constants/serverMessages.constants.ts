export const serverMessages = {
  password: "Password is incorrect!",
  existingUser: "User with such email/username exists in the system!",
  serverError: "Server error!",
  authorisationRequired: "Token is required for authentication",
  invalidToken: "Invalid token!",
  entityNotFound: (entity: string) => `${entity} does not exist!`,
  deletedEntity: (entity: string) => `${entity} has been successfully deleted!`,
};
