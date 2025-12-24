import React from "react";
import { breadcrumbAdmin } from "../../utils/breadcrumbRoutes";
import PageHeader from "./PageHeader";

const ProductReview = () => {
  const breadcrumbs = [breadcrumbAdmin.home, breadcrumbAdmin.productReview];
  return (
    <div>
      <PageHeader title={"Product Review List"} breadcrumbs={breadcrumbs} />
    </div>
  );
};

export default ProductReview;
