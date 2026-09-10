import { NextRequest } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const size = parseInt(searchParams.get('size') || '192');

    const svgPath = path.join(process.cwd(), 'public', 'favicon-egg.svg');
    const svgBuffer = await readFile(svgPath);
    const svgText = svgBuffer.toString('utf-8');

    // Scale the SVG viewBox to the requested size
    const sizedSvg = svgText.replace(
      'viewBox="0 0 512 512"',
      `viewBox="0 0 512 512" width="${size}" height="${size}"`
    );

    return new Response(sizedSvg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (e) {
    console.error('Error serving icon:', e);
    return new Response('Error generating icon', { status: 500 });
  }
}
