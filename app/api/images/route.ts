// app/api/images/route.ts

type UnsplashImage = {
  id: string;
  alt_description: string | null;
  urls: {
    small: string;
    regular: string;
    full: string;
  };
  user: {
    name: string;
  };
};

const apiKey = process.env.IMAGES_API_KEY;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");

    if (!query) {
      return Response.json({ error: "Query required" }, { status: 400 });
    }

    if (!apiKey) {
      return Response.json({ error: "Missing API key" }, { status: 500 });
    }

    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
        query,
      )}&per_page=10&client_id=${apiKey}`,
    );

    if (!res.ok) {
      return Response.json(
        { error: "Failed to fetch images" },
        { status: res.status },
      );
    }

    const data = await res.json();

    // returnez doar imaginile
    const images = data.results.map((img: UnsplashImage) => ({
      id: img.id,
      alt: img.alt_description,
      small: img.urls.small,
      regular: img.urls.regular,
      full: img.urls.full,
      photographer: img.user.name,
    }));

    return Response.json(images);
  } catch (error) {
    return Response.json({ error: "Server error" }, { status: 500 });
    console.error(error);
  }
}
