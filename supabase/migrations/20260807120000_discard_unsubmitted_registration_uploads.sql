-- Let applicants discard files they remove from a registration form before
-- submitting, so the private bucket does not accumulate orphaned objects.
--
-- Deliberately narrow:
--   * only the two prefixes the public upload helper writes to
--   * only objects created in the last 24 hours, so files belonging to an
--     already-submitted registration can never be deleted by the public role
--
-- Object names embed a v4 UUID and anon holds no SELECT policy on this bucket,
-- so paths can neither be listed nor guessed.
grant delete on storage.objects to anon;

create policy "Public discard recent registration uploads" on storage.objects
    for delete using (
        bucket_id = 'registration-documents'
        and (storage.foldername(name))[1] in ('documents', 'signatures')
        and created_at > now() - interval '24 hours'
    );
