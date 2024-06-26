import { useEffect, useState } from "react";
import { CreateDocumentButton } from "./CreateDocumentButton";
import { DocumentCard } from "./DocumentCard";
import { BASE_URL } from "../../../constants/apiUrl";
import { DocumentMeta } from "../../../interfaces/document";
import { authToken } from "../../../constants/authToken";
import { DocumentNotFound } from "./DocumentNotFound";
import { DocumentListSkeleton } from "../../loaders/skeletonScreens/DocumentListSkeleton";
import { toast } from "react-toastify";
import { SearchBar } from "../../shared/SearchBar";

export const DocumentList = () => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [documents, setDocuments] = useState<DocumentMeta[]>([]);

    useEffect(() => {
        const getDocumentsData = async () => {
            const token = localStorage.getItem(authToken) || "";
            try {
                const res = await fetch(`${BASE_URL}/api/docs/getdocuments`, {
                    method: "GET",
                    headers: {
                        "auth-token": token
                    },
                });
                const response = await res.json();
                if (response.success) {
                    setDocuments(response.documents as DocumentMeta[]);
                }
            } catch (error) {
                console.log("Internal Server Error!");
            }
            setLoading(false);
        };
        getDocumentsData();
    }, []);

    const deleteDocumentById = (id: string) => {
        const index = documents.findIndex(doc => doc._id === id);
        if (index !== -1) {
            const updatedDocuments = [...documents];
            updatedDocuments.splice(index, 1);
            setDocuments(updatedDocuments);
            toast.success("document delete successfully");
        }
    }

    const updateDocumentTitle = (id: string, title: string) => {
        const index = documents.findIndex(doc => doc._id === id);
        if (index !== -1) {
            const updatedDocuments = [...documents];
            updatedDocuments[index].title = title;
            setDocuments(updatedDocuments);
        }
    }

    return (
        <div className="px-1 py-4 md:p-4 min-w-72">
            <div className="mb-3 flex flex-col md:flex-row gap-6 md:gap-10 items-center">
                <div className="w-full md:w-auto"><CreateDocumentButton /></div>
                <div className="w-full md:w-auto"><SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} /></div>
            </div>
            {!loading ? (
                <div className="flex flex-col justify-center md:justify-start gap-1 md:gap-2">
                    {documents && (searchQuery.length !== 0 ? documents.filter(doc => doc.title.toLowerCase().startsWith(searchQuery.toLowerCase())) : documents).map(documentData => (
                        <DocumentCard key={documentData._id} documentData={documentData} deleteDocumentById={deleteDocumentById} updateDocumentTitle={updateDocumentTitle} />
                    ))}
                    {(searchQuery.length !== 0 ? documents.filter(doc => doc.title.toLowerCase().startsWith(searchQuery.toLowerCase())) : documents).length === 0 && <DocumentNotFound />}
                </div>
            ) : (
                <DocumentListSkeleton />
            )}
        </div>
    );
};
