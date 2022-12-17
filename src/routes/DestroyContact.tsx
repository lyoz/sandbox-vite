import { ActionFunctionArgs, redirect } from "react-router-dom";
import { deleteContact } from "../contacts";

export const action = async ({ params }: ActionFunctionArgs) => {
  if (params.contactId == null) throw new Error("oh dang!");
  await deleteContact(params.contactId);
  return redirect("/");
};
