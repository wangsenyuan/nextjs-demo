async function getData() {
  try {
    console.log("call api");
    const result = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/langchain/fn/api`,
      { method: "POST", next: { revalidate: 10 } }
    );
    console.log("call api returns");
    let data = await result.json();
    console.log(`get result ${JSON.stringify(data)}`);
    return data;
  } catch (error) {
    console.error(error);
    return {};
  }
}

export default async function Page() {
  const data = await getData();
  return (
    <div>
      <div>agent test result</div>
      <div>{JSON.stringify(data)}</div>
      <div>agent test result done</div>
    </div>
  );
}
