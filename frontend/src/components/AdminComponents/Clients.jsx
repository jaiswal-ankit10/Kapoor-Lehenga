import React from "react";
import PageHeader from "./PageHeader";
import { breadcrumbAdmin } from "../../utils/breadcrumbRoutes";

const Clients = () => {
  const breadcrumbs = [breadcrumbAdmin.home, breadcrumbAdmin.clients];
  return (
    <div>
      <PageHeader title={"Clients List"} breadcrumbs={breadcrumbs} />
    </div>
  );
};

export default Clients;
