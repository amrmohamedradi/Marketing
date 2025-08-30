import { NextRequest, NextResponse } from 'next/server';

const BACKEND_BASE_URL = 'https://backend-marketing-production.up.railway.app';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return forwardRequest(request, params.path, 'GET');
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return forwardRequest(request, params.path, 'POST');
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return forwardRequest(request, params.path, 'PUT');
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return forwardRequest(request, params.path, 'PATCH');
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return forwardRequest(request, params.path, 'DELETE');
}

// Handle OPTIONS preflight locally (204)
export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

async function forwardRequest(
  request: NextRequest,
  pathSegments: string[],
  method: string
) {
  try {
    const path = pathSegments.join('/');
    const url = `${BACKEND_BASE_URL}/api/specs/${path}`;
    
    // Get request body for POST/PUT/PATCH
    let body: string | undefined;
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      body = await request.text();
    }

    // Preserve Content-Type and Authorization headers
    const headers: Record<string, string> = {};
    const contentType = request.headers.get('content-type');
    const authorization = request.headers.get('authorization');
    
    if (contentType) headers['Content-Type'] = contentType;
    if (authorization) headers['Authorization'] = authorization;

    // Forward request to Railway backend
    const response = await fetch(url, {
      method,
      headers,
      body,
    });

    // Get response data and return upstream status/body as-is
    const responseData = await response.text();
    
    return new NextResponse(responseData, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'application/json',
      },
    });

  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { success: false, message: 'Proxy error' },
      { status: 500 }
    );
  }
}
