import { Button, CreatePresentationForm, DashboardContent, DataTable, ViewPresentationDetails } from '@components'
import { projectSpecificPresentations } from '@features'
import { sortBy } from '@utils'
import { useEffect, useMemo, useState } from 'react'
import { FaEye } from 'react-icons/fa'
import { HiPlus } from 'react-icons/hi'
import { useSelector } from 'react-redux'

const MyPresentations = () => {
    const { presentations, pagination, loading } = useSelector((state) => state.presentations);
    const { user } = useSelector((state) => state.auth);
    const [createPresentation, setCreatePresentation] = useState(false);
    const [lastPresentation, setLastPresentation] = useState(null);
    const [viewDetails, setViewDetails] = useState(null);
    const retrieve = useMemo(() => ({ studentId: user._id }), [user._id]);

    const handleViewDetails = (id) => {
        setViewDetails(presentations.find(presentation => presentation._id == id));
    }

    useEffect(() => {
        if (presentations?.length) {
            const sorted = sortBy(presentations, 'createdAt', 'desc');
            setLastPresentation(sorted[0]);
        } else {
            setLastPresentation(null);
        }
    }, [presentations]);

    return (
        <DashboardContent title='My Presentations' description='View and manage your project presentations'>
            <div className="flex justify-between items-center gap-5 p-2 mb-2">
                <h4 className="font-black text-theme mb-0">Project Presentations</h4>

                {(lastPresentation?.fyp !== "fypFinal" || lastPresentation?.status === "rejected") ? (
                    <Button className="text-sm" onClick={() => setCreatePresentation(true)}>
                        <HiPlus /> New Presentation
                    </Button>
                ) : (
                    <Button type="button" disabled={true} className="text-sm">
                        <HiPlus /> New Presentation
                    </Button>
                )}
            </div>

            {createPresentation && (
                <CreatePresentationForm lastPresentation={lastPresentation} projectId={user?._id} isLoading={loading} closeForm={() => setCreatePresentation(false)} />
            )}

            {viewDetails && (
                <ViewPresentationDetails presentation={viewDetails} closeForm={() => setViewDetails(null)} />
            )}

            <DataTable
                empty="No progress updates are available for your project."
                onChange={projectSpecificPresentations}
                retrieve={retrieve}
                recordList={presentations}
                paginationData={pagination}
                recordFields={{
                    summary: 'Summary',
                    remarks: 'Remarks',
                    fyp: 'Phase',
                    status: 'Status',
                }}
                actions={[
                    { label: "Details", icon: <FaEye />, ShowWhen: { status: true }, onClick: handleViewDetails },
                ]}
                searchableFields={{
                    summary: 'Summary',
                    remarks: 'Remarks',
                    fyp: 'Phase',
                    status: "Status",
                }}
            />
        </DashboardContent >
    )
}

export default MyPresentations