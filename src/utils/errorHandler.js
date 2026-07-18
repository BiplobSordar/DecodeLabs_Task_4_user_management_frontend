export const getErrorMessage = (error) => {
  if (!error) {
    return "Something went wrong.";
  }

  if (typeof error === "string") {
    return error;
  }

  if (error.response?.data?.errors?.length) {
    return error.response.data.errors
      .map((item) => item.message)
      .join(", ");
  }

  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.message) {
    return error.message;
  }

  return "Unexpected error occurred.";
};