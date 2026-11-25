import { redirect } from "next/navigation";

export default async function SignInAlias({ searchParams }) {
  const params = await searchParams;
  const nextPath = params?.next
    ? `?next=${encodeURIComponent(params.next)}`
    : "";
  redirect(`/signin${nextPath}`);
}
