import React from "react";
import PageHeader from "./PageHeader";
import { breadcrumbAdmin } from "../../utils/breadcrumbRoutes";

const Inquiry = () => {
  const breadcrumbs = [breadcrumbAdmin.home, breadcrumbAdmin.inquiry];
  return (
    <div>
      <PageHeader title={"Inquiry List"} breadcrumbs={breadcrumbs} />
    </div>
  );
};

export default Inquiry;
