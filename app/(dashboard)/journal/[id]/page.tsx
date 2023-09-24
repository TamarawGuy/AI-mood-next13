import Editor from "@/components/Editor";
import { findByClerkId } from "@/utils/auth";
import { prisma } from "@/utils/db";

type Params = {
  params: {
    id: string;
  };
};

const getEntry = async (id) => {
  const user = await findByClerkId();
  const entry = await prisma.journalEntry.findUnique({
    where: {
      userId_id: {
        userId: user.id,
        id,
      },
    },
    include: {
      analysis: true,
    },
  });

  return entry;
};

const EntryPage = async ({ params }: Params) => {
  const entry = await getEntry(params.id);

  return (
    <div className="w-full h-full grid">
      <Editor entry={entry} />
    </div>
  );
};

export default EntryPage;
