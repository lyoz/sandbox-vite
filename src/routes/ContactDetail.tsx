import {
  ActionFunctionArgs,
  Form,
  LoaderFunctionArgs,
  useFetcher,
  useLoaderData,
} from "react-router-dom";
import { Contact, getContact, updateContact } from "../contacts";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  if (params.contactId == null) return null;
  return getContact(params.contactId);
};

type LoaderData = Awaited<ReturnType<typeof loader>>;

export const action = async ({ request, params }: ActionFunctionArgs) => {
  if (params.contactId == null) return null;
  const formData = await request.formData();
  return updateContact(params.contactId, {
    favorite: formData.get("favorite") === "true",
  });
};

export const ContactDetail = () => {
  const contact = useLoaderData() as LoaderData;

  if (contact == null) return null;

  return (
    <div id="contact">
      <div>
        <img key={contact.avatar} src={contact.avatar} />
      </div>

      <div>
        <h1>
          {contact.first || contact.last ? (
            <>
              {contact.first} {contact.last}
            </>
          ) : (
            <i>No Name</i>
          )}
          <Favorite contact={contact} />
        </h1>

        {contact.twitter && (
          <p>
            <a
              target="_blank"
              href={`https://twitter.com/${contact.twitter}`}
              rel="noreferrer"
            >
              {contact.twitter}
            </a>
          </p>
        )}

        {contact.notes && <p>{contact.notes}</p>}

        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>
          <Form
            method="post"
            action="destroy"
            onSubmit={(event) => {
              if (!confirm("Please confirm you want to delete this record.")) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  );
};

function Favorite({ contact }: { contact: Contact }) {
  const fetcher = useFetcher();
  const favorite = contact.favorite;

  return (
    <fetcher.Form method="post">
      <button
        name="favorite"
        value={favorite ? "false" : "true"}
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
      >
        {favorite ? "★" : "☆"}
      </button>
    </fetcher.Form>
  );
}
