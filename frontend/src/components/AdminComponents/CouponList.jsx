import React, { useState } from "react";
import { breadcrumbAdmin } from "../../utils/breadcrumbRoutes";
import PageHeader from "./PageHeader";
import { Plus, Search } from "lucide-react";

const CouponList = () => {
  const [coupons, setCoupons] = useState([]);
  const breadcrumb = [breadcrumbAdmin.home, breadcrumbAdmin.coupon];
  return (
    <div>
      <PageHeader
        title={"Coupon List"}
        breadcrumbs={breadcrumb}
        buttonText={"Add Coupon"}
        Icon={Plus}
        handleClick={(e) => e.preventDefault()}
        buttonBg={"bg-[#E9B159]"}
        buttonTextColor={"text-white"}
      />

      <div className="bg-white p-4 rounded shadow-xl my-6">
        <div className="flex flex-wrap gap-4 items-center justify-between p-5 ">
          <select className="border rounded-md px-3 py-2 text-sm text-gray-600">
            <option>10 rows</option>
            <option>20 rows</option>
            <option>50 rows</option>
          </select>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                placeholder="Search"
                className="pl-9 pr-4 py-2 border rounded-md text-sm w-64"
              />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-5 py-3 text-left whitespace-nowrap min-w-max">
                  ACTION
                </th>
                <th className="px-5 py-3 text-left whitespace-nowrap min-w-max">
                  COUPON NAME
                </th>
                <th className="px-5 py-3 text-center whitespace-nowrap min-w-max">
                  COUPON CODE
                </th>
                <th className="px-5 py-3 text-center whitespace-nowrap min-w-max">
                  COUPON STATUS
                </th>
                <th className="px-5 py-3 text-center whitespace-nowrap min-w-max">
                  COUPON VALUE
                </th>
                <th className="px-5 py-3 text-center whitespace-nowrap min-w-max">
                  MINIMUM PURCHASE AMOUNT
                </th>
                <th className="px-5 py-3 text-center whitespace-nowrap min-w-max">
                  MAXIMUM USERS USE LIMIT
                </th>
                <th className="px-5 py-3 text-center whitespace-nowrap min-w-max">
                  FOR NEW MEMBER
                </th>
                <th className="px-5 py-3 text-center whitespace-nowrap min-w-max">
                  USER USAGE TYPE
                </th>
                <th className="px-5 py-3 text-center whitespace-nowrap min-w-max">
                  COUPON START DATE
                </th>
                <th className="px-5 py-3 text-center whitespace-nowrap min-w-max">
                  COUPON END DATE
                </th>
              </tr>
            </thead>
            <tbody>
              {coupons?.map((coupon, index) => {
                <tr key="index">{!coupon && "Data not found"}</tr>;
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CouponList;
