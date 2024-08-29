'use server'
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    console.log(body);
    
    const response = await fetch('http://localhost:8080/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    console.log('Response status:', response.status);
    const responseBody = await response.text();
    console.log('Response body:', responseBody);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = JSON.parse(responseBody);
    console.log(data);

    return null;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    return NextResponse.json({ error: 'Failed to forward request' }, { status: 500 });
  }
}