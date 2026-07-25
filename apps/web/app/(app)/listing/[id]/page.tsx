// Listing detail page
export default function ListingDetailPage({ params }: { params: { id: string } }) {
  return <main>Listing: {params.id}</main>;
}
