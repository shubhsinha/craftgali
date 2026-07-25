// Public artist portfolio page — F-09
export default function ArtistPortfolioPage({ params }: { params: { handle: string } }) {
  return <main>Artist: {params.handle}</main>;
}
