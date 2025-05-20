"use client";

import { usePathname } from "next/navigation";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

function BreadcrumbHeader() {
  const pathName = usePathname();
  const paths = pathName === "/" ? [""] : pathName.split("/");

  // Special case for agent pages
  const isAgentPage = paths.includes("agent") && paths.length > 2;
  const agentId = isAgentPage ? paths[paths.indexOf("agent") + 1] : null;

  return (
    <div className="flex items-center flex-start">
      <Breadcrumb>
        <BreadcrumbList>
          {paths.map((path, index) => {
            // Special handling for the root path
            if (path === "") {
              return (
                <React.Fragment key={index}>
                  <BreadcrumbItem>
                    <BreadcrumbLink href={isAgentPage ? "/dashboard" : "/"}>
                      {isAgentPage ? "Dashboard" : "Home"}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                </React.Fragment>
              );
            }

            // For agent pages, show the agent ID
            if (isAgentPage && path === agentId) {
              return (
                <React.Fragment key={index}>
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      className="capitalize"
                      href={`/agent/${path}`}
                    >
                      {path}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {index !== paths.length - 1 && <BreadcrumbSeparator />}
                </React.Fragment>
              );
            }

            return (
              <React.Fragment key={index}>
                <BreadcrumbItem>
                  <BreadcrumbLink className="capitalize" href={`/${path}`}>
                    {path}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {index !== paths.length - 1 && <BreadcrumbSeparator />}
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}

export default BreadcrumbHeader;
