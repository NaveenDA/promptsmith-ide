"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { PlusIcon, SaveIcon, Settings, Sparkles } from "lucide-react";
import { Badge } from "./ui/badge";
import { Textarea } from "@/components/ui/textarea";
//
const userMessages = [
  {
    id: "#122313",
    scenario: "Normal Use Case",
    message: [
      "Hello, I need to extract the invoice information from the following text: Invoice Number: 1234567890, Invoice Date: 2021-01-01, Invoice Amount: $100.00, Invoice Due Date: 2021-01-01, Invoice Status: Paid, Invoice Payment Status: Paid, Invoice Payment Method: Credit Card, Invoice Payment Date: 2021-01-01, Invoice Payment Amount: $100.00",
      "Let me know if you need any more information.",
    ],
  },
  {
    id: "#12231412",
    scenario: "Different Format",
    message: [
      `INVOICE
ELLINGTON
Ellington Wood Decor, 36 Terrick Rd, Ellington PE18 2NT, United Kingdom
BILL TO
Your client
11 Beech Dr
Ellington
NE61 SEU
United Kingdom
Invoice No.
Issue date:
Due date:
Reference:
042022
30/04/2022
14/05/2022
042022
DESCRIPTION
Sample service
Sample wood decoration service
Sample sarvice 1
Sample wood decoration service 1
QUANTITY
UNIT PRICE (E)
400.00
AMOUNT (E)
400.00
200.00
200.00
TOTAL (GBP):
TOTAL DUE (GBP)
£600.00
£800.00
Issued by, signature:
Ellington Wood Decor`,
    ],
  },
  {
    id: "#122314",
    scenario: "Different Currency",
    message: [
      "Invoice Number: 1234567890, Invoice Date: 2021-01-01, Invoice Amount: 100.00 EUR, Invoice Due Date: 2021-01-01, Invoice Status: Paid, Invoice Payment Status: Paid, Invoice Payment Method: Credit Card, Invoice Payment Date: 2021-01-01, Invoice Payment Amount: 100.00 EUR",
    ],
  },
  {
    id: "#122315",
    scenario: "Invalid Data",
    message: [
      "Invoice Number {{ObjectNotFound}}",
    ],
  },
];
const PromptEditor = () => {
  return (
    <div className="w-full border-r">
      <div className="flex justify-between items-center border-b p-4 px-6">
        <div className="">
          <h3 className="text-lg font-bold ">Invoice Extractor</h3>
          <Settings className="w-4 h-4 inline-block" /> &nbsp;
          <Badge variant="outline" className="">
            OpenAI
          </Badge>{" "}
          &nbsp;
          <Badge variant="outline" className="">
            GPT-4o
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm">
            <Sparkles className="w-4 h-4" />
            Validate
          </Button>
          <Button size="sm" disabled>
            <SaveIcon className="w-4 h-4" />
            Save
          </Button>
        </div>
      </div>
      <div className="p-4 px-6 border-b">
        <h3 className="text-lg font-bold">System Instructions</h3>
        <div className="">
          <Textarea
            placeholder="Enter your system instructions here"
            className="w-full"
            rows={5}
            defaultValue={`You are a helpful assistant that can extract information from the invoice.

Please extract the following information from the invoice:
- Invoice Number
- Invoice Date
- Invoice Amount
- Invoice Due Date
- Invoice Status
- Invoice Payment Status
- Invoice Payment Method
- Invoice Payment Date
- Invoice Payment Amount

Return JSON format.`}
          />
        </div>
      </div>
      <div className="p-4 px-6 border-b">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold">User Messages</h3>
          <Button variant="outline" size="sm">
            <PlusIcon className="w-4 h-4" />
            New Group
          </Button>
        </div>

        <ol className="relative border-s border-gray-200 dark:border-gray-700">
          {userMessages.map((message) => (
            <li className="mb-10 ms-4 group" key={message.id}>
              <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700" />
              <span className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                {message.id}
              </span>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {message.scenario}
              </h3>
              {message.message.map((msg, index) => (
                <p
                  className="mb-4 text-base font-normal border p-2 rounded-md text-gray-500 dark:text-gray-400"
                  key={index}
                >
                  {msg}
                </p>
              ))}
              {/* Add a button to add a new message */}
              <Button
                variant="outline"
                size="sm"
                className="group-hover:inline-block hidden duration-700 ease-in-out"
              >
                Add Message
              </Button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default PromptEditor;
