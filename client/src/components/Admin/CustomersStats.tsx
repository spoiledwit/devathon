import React from "react";
import { Info } from "lucide-react";
import { CustomersChart } from "./Charts";
import { Link } from "react-router-dom";

const CustomersStats = () => {
  return (
    <React.Fragment>
      <div className="order-10 mt-2 col-span-12 2xl:order-1 card 2xl:col-span-4">
        <div className="card-body">
          <div className="flex items-center gap-2 mb-3">
            <h6 className="text-15 grow">
              Monthly New vs Returning Customers{" "}
              <Link
                to="#!"
                data-tooltip="default"
                data-tooltip-content="Compare new customer acquisition with returning customer visits each month"
                className="inline-block align-middle ltr:ml-1 rtl:mr-1 text-slate-500 dark:text-zink-200"
              >
                <Info className="size-4"></Info>
              </Link>
            </h6>
          </div>
          <CustomersChart
            chartId="customerStats"
            data-chart-colors='["bg-blue-500", "bg-green-500"]'
          />
        </div>
      </div>
    </React.Fragment>
  );
};

export default CustomersStats;
