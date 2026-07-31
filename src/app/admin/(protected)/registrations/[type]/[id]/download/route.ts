import { NextResponse } from 'next/server';
import { isAdminEmail, isRegistrationType } from '@/constants/admin';
import {
  buildRegistrationZip,
  registrationZipFileName,
} from '@/lib/admin/registrationExport';
import { getRegistrationDetail } from '@/lib/admin/registrations';
import { createClient } from '@/lib/supabase/server';

type RouteContext = {
  params: Promise<{ type: string; id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdminEmail(user.email)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { type: typeRaw, id: idRaw } = await context.params;
  if (!isRegistrationType(typeRaw)) {
    return NextResponse.json({ error: 'Invalid registration type' }, { status: 400 });
  }

  const id = Number(idRaw);
  if (!Number.isFinite(id) || id <= 0) {
    return NextResponse.json({ error: 'Invalid registration id' }, { status: 400 });
  }

  const detail = await getRegistrationDetail(typeRaw, id);
  if (!detail) {
    return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
  }

  try {
    const zipBytes = await buildRegistrationZip(detail);
    const fileName = registrationZipFileName(detail);

    return new NextResponse(Buffer.from(zipBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Failed to build registration ZIP:', error);
    return NextResponse.json(
      { error: 'Could not build registration download' },
      { status: 500 },
    );
  }
}
