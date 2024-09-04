import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('userId');
  const organizationId = searchParams.get('orgId') || "";
  console.log(userId, organizationId);
  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 });
  }

  try { 
    const projects = await convex.query(api.cli.getCliProjects, { 
      userId, 
      organizationId: organizationId || undefined
    });
    console.log('Projects received:', projects);  
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}
