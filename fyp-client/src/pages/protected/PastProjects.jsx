import { Button, DashboardContent, DataTable, ViewProposalDetails } from '@components'
import { retrievePastFyps, retrieveProposals } from '@features'
import { formatFilePath } from '@utils';
import { useEffect, useMemo, useState } from 'react';
import { FaDownload, FaEye } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux'

const ALLOWED_PDFS = new Set([
    "applications/16SW.pdf",
    "applications/17SW.pdf",
    "applications/18SW.pdf",
    "applications/19SW.pdf",
    "applications/20SW.pdf",
]);

const PDF_ORDER = ["16SW", "17SW", "18SW", "19SW", "20SW"];
const getBatchLabel = (pdfPath = "") => {
    const filename = (pdfPath.split("/").pop() ?? "").replace(".pdf", "");
    return filename ? `${filename.toUpperCase()} PAST FYPs` : "PAST FYP";
};

const PastProjects = ({ status = "past" }) => {
    const dispatch = useDispatch();
    const { proposals, pagination } = useSelector((state) => state.proposals);
    const { pastFyps, loading: pastLoading } = useSelector((state) => state.pastFyp);
    const [viewDetails, setViewDetails] = useState(null);
    const retrieve = useMemo(() => ({ status }), [status]);

    const visiblePastFyps = useMemo(() => {
        return (pastFyps ?? [])
            .filter((record) => ALLOWED_PDFS.has(record.pdf_file))
            .sort((a, b) => {
                const getOrder = (value = "") => {
                    const file = value.split("/").pop() ?? "";
                    const key = file.replace(".pdf", "");
                    const index = PDF_ORDER.indexOf(key);
                    return index === -1 ? 999 : index;
                };
                return getOrder(a.pdf_file) - getOrder(b.pdf_file);
            });
    }, [pastFyps]);

    const handleViewDetails = (id) => {
        setViewDetails(proposals.find(proposal => proposal._id == id));
    }

    useEffect(() => {
        if (status !== "past") return;

        dispatch(retrievePastFyps({
            page: {
                current: 1,
                size: 100,
                query: {},
                sort: { createdAt: -1 }
            }
        }));
    }, [dispatch, status]);

    if (status === "past") {
        return (
            <DashboardContent title="Past FYPs" description="View and search past final year projects">
                <div className="mb-6 rounded-xl border border-primary bg-primary p-6 shadow-sm">
                    <h4 className="mb-2 text-2xl font-black text-theme">Past FYPs</h4>
                    <p className="mb-0 text-sm text-secondary">
                        Browse previous Final Year Projects and open or download each PDF.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {visiblePastFyps.map((record) => (
                        <div
                            key={record._id}
                            className="group rounded-xl border border-primary bg-primary p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                        >
                            <div className="mb-4">
                                <span className="inline-block rounded-full bg-theme/10 px-3 py-1 text-xs font-semibold tracking-wide text-theme">
                                    Archive
                                </span>
                                <h5 className="mt-3 mb-0 text-lg font-bold text-theme">{getBatchLabel(record.pdf_file)}</h5>
                            </div>

                            <div className="mt-2 flex flex-wrap gap-2">
                                <Button href={formatFilePath(record.pdf_file)} target="_blank" rel="noreferrer" className="text-sm px-3 py-2">
                                    <FaEye /> View PDF
                                </Button>
                                <a
                                    href={formatFilePath(record.pdf_file)}
                                    download
                                    target="_blank"
                                    rel="noreferrer"
                                    className="button-secondary inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm"
                                >
                                    <FaDownload /> Download
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                {!pastLoading && visiblePastFyps.length === 0 && (
                    <div className="rounded-xl border border-primary bg-primary p-8 text-center text-secondary italic">
                        No past FYPs available right now.
                    </div>
                )}
            </DashboardContent>
        );
    }

    return (
        <DashboardContent title={status == "supervised" ? "Previously Supervised Projects" : "Previous Projects"} description={"All previous projects from years"}>
            <div className="flex justify-between items-center gap-5 p-2 mb-2">
                <h4 className="font-black text-theme mb-0">
                    {status == "supervised" ? "Previously Supervised Projects" : "Previous Projects"}
                </h4>
            </div>

            {viewDetails && (
                <ViewProposalDetails isPastProject proposal={viewDetails} closeForm={() => setViewDetails(null)} />
            )}

            <DataTable
                onChange={retrieveProposals}
                retrieve={retrieve}
                recordList={proposals}
                paginationData={pagination}
                recordFields={{
                    ...(status == "supervised" ? { "lead.name": "Team Lead" } : { "supervisor.name": "Supervisor" }),
                    title: "Title",
                    department: "department",
                    batch: "batch",
                    category: "Category",
                    type: "Type",
                }}
                actions={[
                    { label: "Details", icon: <FaEye />, ShowWhen: { status: true }, onClick: handleViewDetails },
                ]}
                searchableFields={{
                    title: "Title",
                    department: "department",
                    batch: "batch",
                    category: "Category",
                    type: "Type",
                    absract: "Abstract",
                }}
                empty={status == "supervised" ? "No previously your supervised projects to show" : "No previous projects found"}
            />
        </DashboardContent >
    )
}

export default PastProjects
