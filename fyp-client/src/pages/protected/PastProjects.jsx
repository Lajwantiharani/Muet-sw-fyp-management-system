import { Button, DashboardContent, DataTable, ViewProposalDetails } from '@components'
import { retrievePastFyps, retrieveProposals, retrieveImportedProjects } from '@features'
import { formatFilePath } from '@utils';
import { useEffect, useMemo, useState } from 'react';
import { FaDownload, FaEye, FaFileExcel } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux'
import Overlay from '@components/app/Overlay';

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
    const { pastFyps, loading: pastLoading, excelProjects, excelPagination, excelLoading } = useSelector((state) => state.pastFyp);
    const [viewDetails, setViewDetails] = useState(null);
    const [viewImport, setViewImport] = useState(null);
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

    useEffect(() => {
        if (status !== "past") return;

        dispatch(retrieveImportedProjects({
            page: {
                current: 1,
                size: 10,
                sort: { createdAt: -1 }
            }
        }));
    }, [dispatch, status]);

    if (status === "past") {
        return (
            <DashboardContent title="Past FYPs" description="View and search past final year projects">
                <div className="mb-6 rounded-2xl border border-primary bg-primary/80 p-6 shadow-sm">
                    <h4 className="mb-2 text-2xl font-black text-theme">Past FYPs</h4>
                    <p className="mb-0 text-sm text-secondary">
                        Browse previous Final Year Projects and open or download each PDF.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 rounded-2xl border border-primary bg-primary p-4 shadow-sm">
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

                <div className="mt-10 space-y-4">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between rounded-2xl border border-primary bg-primary p-4 shadow-sm">
                        <div>
                            <h4 className="mb-1 text-xl font-black text-theme">Past Projects </h4>
                            <p className="text-secondary text-sm mb-0">Search fyps for all batches.</p>
                        </div>
                        <span className="inline-flex items-center gap-2 rounded-full bg-theme/10 px-4 py-2 text-theme text-sm font-semibold shadow-sm">
                       
                        </span>
                    </div>

                    <div className="rounded-2xl border border-primary bg-primary p-4 shadow-sm">
                        <DataTable
                            onChange={retrieveImportedProjects}
                            retrieve={{}}
                            recordList={excelProjects ?? []}
                            paginationData={excelPagination ?? {}}
                            wrap={false}
                            actions={[
                                { label: "View", icon: <FaEye />, onClick: (rec) => setViewImport(rec) },
                            ]}
                            onRowClick={(rec) => setViewImport(rec)}
                            recordFields={{
                                batch: "Batch",
                                title: "Title",
                                supervisorName: "Supervisor",
                                membersLabel: "Members",
                                abstract: "Abstract",
                            }}
                            searchableFields={{
                                title: "Title",
                                batch: "Batch",
                                supervisorName: "Supervisor",
                                membersLabel: "Members",
                                abstract: "Abstract",
                            }}
                            isLoading={excelLoading}
                            empty="No imported projects available yet"
                            // contentOnly
                        />
                    </div>
                </div>

                {!pastLoading && visiblePastFyps.length === 0 && (
                    <div className="rounded-xl border border-primary bg-primary p-8 text-center text-secondary italic">
                        No past FYPs available right now.
                    </div>
                )}

                {viewImport && (
                    <Overlay title="Imported Project Details" onClose={() => setViewImport(null)} width="max-w-4xl">
                        <div className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 rounded-lg border border-primary bg-primary-hover">
                                    <p className="text-xs uppercase text-secondary mb-1">Batch</p>
                                    <p className="font-semibold mb-0">{viewImport.batch || "-"}</p>
                                </div>
                                <div className="p-4 rounded-lg border border-primary bg-primary-hover">
                                    <p className="text-xs uppercase text-secondary mb-1">Supervisor</p>
                                    <p className="font-semibold mb-0">{viewImport.supervisor?.name || viewImport.supervisorName || "-"}</p>
                                    {viewImport.supervisor?.department && (
                                        <p className="text-sm text-secondary mb-0">{viewImport.supervisor.department}</p>
                                    )}
                                </div>
                            </div>

                            <div className="p-4 rounded-lg border border-primary bg-primary-hover">
                                <p className="text-xs uppercase text-secondary mb-1">Title</p>
                                <p className="font-semibold text-lg mb-0">{viewImport.title || "-"}</p>
                            </div>

                            <div className="p-4 rounded-lg border border-primary bg-primary-hover">
                                <p className="text-xs uppercase text-secondary mb-2">Members</p>
                                <div className="flex flex-wrap gap-2">
                                    {(viewImport.group?.members ?? [])
                                        .map((m) => m.name)
                                        .filter(Boolean)
                                        .map((name) => (
                                            <span key={name} className="px-3 py-1 rounded-full bg-theme/10 text-theme text-sm font-semibold">
                                                {name}
                                            </span>
                                        ))}
                                    {(!viewImport.group?.members || viewImport.group.members.length === 0) && (
                                        <span className="text-secondary text-sm">No members listed.</span>
                                    )}
                                </div>
                            </div>

                            <div className="p-4 rounded-lg border border-primary bg-primary-hover">
                                <p className="text-xs uppercase text-secondary mb-2">Abstract</p>
                                <p className="mb-0 leading-6 whitespace-pre-wrap text-primary">
                                    {viewImport.abstract || "No abstract provided."}
                                </p>
                            </div>
                        </div>
                    </Overlay>
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
