"use client";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import dynamic from "next/dynamic";
import "@/app/sass/csvUploader.scss";
import { Download } from "react-feather";

const Select = dynamic(() => import("react-select"), { ssr: false });

const options = [
  { value: "Stock In", label: "Stock In" },
  { value: "Stock Out", label: "Stock Out" },
];

const FileUpload = () => {
  const { control, handleSubmit, reset } = useForm();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [jsonData, setJsonData] = useState<any[]>([]);

  // Function to convert CSV to JSON
  const parseCSVtoJSON = (csvText: string) => {
    const rows = csvText
      .split("\n")
      .map((row) => row.trim())
      .filter((row) => row !== "");
    const headers = rows[0].split(",");
    const jsonArray = rows.slice(1).map((row) => {
      const values = row.split(",");
      let obj: { [key: string]: string } = {};
      headers.forEach((header, index) => {
        obj[header.trim()] = values[index]?.trim() || "";
      });
      return obj;
    });
    setJsonData(jsonArray);
    console.log("jsonArray", jsonArray);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        parseCSVtoJSON(text);
      };
      reader.readAsText(file);
    }
  };

  const onSubmit = (data: any) => {
    if (!selectedFile) {
      alert("Please select a file to import.");
      return;
    }
    console.log("Payload JSON:", jsonData); // This JSON can be sent via API
  };

  const handleReset = () => {
    setSelectedFile(null);
    setJsonData([]);
    reset();
  };

  const downloadSampleCSV = () => {
    const headers = [
      "Product Name",
      "Unit",
      "Sale Price",
      "Purchase Price",
      "Quantity",
      "Stock Alert",
    ];

    const sampleData = [
      ["Example Product 1", "box", "100", "80", "50", "5"],
      ["Example Product 2", "bottle", "200", "150", "30", "10"],
    ];

    // Add a list of all available units at the bottom of the CSV
    const unitOptions = [
      "Available Units:",
      "box",
      "bottle",
      "packet",
      "carton",
      "dozen",
      "gram",
      "kilogram",
      "liter",
      "milliliter",
      "piece",
      "set",
    ];

    let csvContent =
      "data:text/csv;charset=utf-8," +
      headers.join(",") +
      "\n" +
      sampleData.map((row) => row.join(",")).join("\n") +
      "\n\n" +
      unitOptions.join(",");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "sample-file.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-4 bg-gray-100 rounded-lg grid items-center gap-1"
    >
      <div className="flex gap-4">
        <Controller
          name="category"
          control={control}
          defaultValue={options[0]}
          render={({ field }) => (
            <Select {...field} options={options} className="w-40" />
          )}
        />

        <input type="file" onChange={handleFileChange} className="border p-2" />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Import
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Reset
        </button>
      </div>

      <span
        onClick={downloadSampleCSV}
        className="text-blue-600 flex items-center gap-1"
      >
        <Download size={20} /> Download Sample File
      </span>
    </form>
  );
};

export default FileUpload;
