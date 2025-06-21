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

export async function GET(request: NextRequest) {
    if (!supabaseUrl || !supabaseKey) {
        const errorResponse = NextResponse.json({ error: 'Database configuration missing' }, { status: 500 });
        return addCorsHeaders(errorResponse);
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    let { data: products, error } = await supabase
        .from('products')
        .select('*');

    if (error) {
        const errorResponse = NextResponse.json({ error: error.message }, { status: 500 });
        return addCorsHeaders(errorResponse);
    }

    const response = NextResponse.json(products);
    return addCorsHeaders(response);
}

export async function POST(request: NextRequest) {
    if (!supabaseUrl || !supabaseKey) {
        const errorResponse = NextResponse.json({ error: 'Database configuration missing' }, { status: 500 });
        return addCorsHeaders(errorResponse);
    }

    try {
        const body = await request.json();
        const { filters, search, limit, offset } = body;

        const supabase = createClient(supabaseUrl, supabaseKey);
        let query = supabase.from('products').select('*');

        // Apply filters if provided
        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                query = query.eq(key, value);
            });
        }

        // Apply search if provided
        if (search) {
            query = query.ilike('name', `%${search}%`).limit(1);
        }

        // Apply pagination if provided
        if (limit) {
            query = query.limit(limit);
        }
        if (offset) {
            query = query.range(offset, offset + (limit || 10) - 1);
        }

        const { data: products, error } = await query;

        if (error) {
            const errorResponse = NextResponse.json({ error: error.message }, { status: 500 });
            return addCorsHeaders(errorResponse);
        }

        const response = NextResponse.json(products);
        return addCorsHeaders(response);
    } catch (error) {
        const errorResponse = NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
        return addCorsHeaders(errorResponse);
    }
}