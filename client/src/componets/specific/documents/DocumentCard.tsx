import { useEffect, useState } from "react";
import { DocumentMeta } from "../../../interfaces/document";
import { formattedDate } from "../../../utils/FormateDate";
import Logo from '/logo.svg';
import { useNavigate } from "react-router-dom";
import { DocumentCardSkeleton } from "../../loaders/skeletonScreens/DocumentCardSkeleton";
import { UpdateTitleField } from "./UpdateTitleField";

export interface DocumentCardProps {
  documentData: DocumentMeta;
}

export const DocumentCard = ({ documentData }: DocumentCardProps) => {
  const [show,setShow] =useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [title,setTitle]=useState<string>('');
  const [createdAt, setCreatedAt] = useState<string>('');
  const [updatedAt, setUpdatedAt] = useState<string>('');
  const navigate = useNavigate();

  const toggalShow = ()=> setShow(prev => !prev);

  useEffect(() => {
    const updateDatesFormate = () => {
      setCreatedAt(formattedDate(documentData.createdAt))
      setUpdatedAt(formattedDate(documentData.updatedAt))
      setTitle(documentData.title)
    }
    updateDatesFormate();
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div>
      {loading ? <DocumentCardSkeleton/> :
        <div className="border p-4 w-96 md:w-[40rem] rounded shadow flex items-center justify-start gap-3 md:gap-4 flex-col md:flex-row">
          <div className='flex items-center justify-start gap-3 md:gap-4 flex-col md:flex-row'>
            <img src={Logo} alt="Logo" className='w-10' />
            <div className="flex flex-col">
              {!show ? <span onClick={toggalShow} className="text-lg font-semibold">{title}</span> :<UpdateTitleField id={documentData._id} title={title} toggalShow={toggalShow} setTitle={setTitle} />}
              <span className="text-sm text-gray-500">Created at: {createdAt}</span>
              <span className="text-sm text-gray-500">Last Modified at: {updatedAt}</span>
            </div>
          </div>
          <div onClick={() => navigate(`/document/${documentData.documentId}`)}>Edit</div>
        </div>
      }
    </div>
  );
};
