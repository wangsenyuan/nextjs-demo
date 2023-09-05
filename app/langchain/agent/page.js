async function getData() {
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/langchain/agent/api`,
    { method: "POST", next: { revalidate: 10 } }
  );
  let data = await result.json();
  console.log(`get result ${JSON.stringify(data)}`);
  return data;
}

export default async function Page() {
  const data = await getData();
  return (
    <div>
      <div>agent test result</div>
      <div>{data.result}</div>
      <div>agent test result done</div>
    </div>
  );
}
