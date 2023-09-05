async function getData() {
  try {
    const result = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/langchain/memory/api`,
      { method: "POST", next: { revalidate: 10 } }
    );
    let data = await result.json();
    console.log(`get result ${JSON.stringify(data)}`);
    return data;
  } catch (error) {
    console.error("failed to get data");
    console.error(error);
    return {};
  }
}

export default async function Page() {
  const data = await getData();
  return (
    <div>
      <div>memory test result</div>
      <div>{data?.res1?.response}</div>
      <div>{data?.res2?.response}</div>
      <div>memory test result done</div>
    </div>
  );
}
