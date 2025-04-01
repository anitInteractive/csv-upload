import Image from "next/image";
import styles from "./page.module.css";
import FileUpload from "./components/csvUploader";

export default function Home() {
  return (
    <div className={styles.page}>
      Csv Upload
      <FileUpload />
    </div>
  );
}
