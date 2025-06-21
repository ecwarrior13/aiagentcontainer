import { NextRequest, NextResponse } from 'next/server';

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Helper function to add CORS headers
function addCorsHeaders(response: NextResponse) {
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return response;
}

export async function OPTIONS(request: NextRequest) {
    return addCorsHeaders(new NextResponse(null, { status: 200 }));
}


export async function POST(request: NextRequest) {
    if (!supabaseUrl || !supabaseKey) {
        const errorResponse = NextResponse.json({ error: 'Database configuration missing' }, { status: 500 });
        return addCorsHeaders(errorResponse);
    }

    try {
        const body = await request.json();
        const { email, name, phone } = body;

        // Log the incoming data to see what's being sent
        console.log('Received data:', { email, name, phone });

        // Return a simple thank you response
        const response = NextResponse.json({ message: 'Thank you' }, { status: 200 });
        return addCorsHeaders(response);
    } catch (error) {
        const errorResponse = NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
        return addCorsHeaders(errorResponse);
    }
}