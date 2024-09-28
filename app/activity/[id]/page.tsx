"use client";

import RecentActivity from "@/components/activity/Activities";
import { useEffect, useState } from "react";
import { activityData } from "@/components/activity/activityData";
import Link from "next/link";

export default function Page({ params }: { params: { id: string } }) {
  const [isInId, setIsInId] = useState<boolean>(false);

  useEffect(() => {
    const idExists = activityData.some((item) => item.daoId === params.id);
    setIsInId(idExists);
  }, [params.id]);

  if (!params.id) {
    return <div>No ID provided</div>; // or a loading indicator
  }

  if (isInId && params.id) {
    console.log(isInId)
    return <RecentActivity id={params.id} />;
  } else {
    return (
      <div>
        Go back <Link href={"/create/activity"}>to activity page </Link>
      </div>
    ); // or a loading indicator
  }
}
