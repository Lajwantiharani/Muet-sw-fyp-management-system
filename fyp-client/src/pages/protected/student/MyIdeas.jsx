import { Button, CreateProposalForm, DashboardContent, DataTable, ViewProposalDetails } from '@components'
import { retrieveManyProposal } from '@features'
import { useEffect, useMemo, useState } from 'react'
import { FaLightbulb } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { useLoaderData } from 'react-router-dom'

const MyIdeas = () => {
    const loaderData = useLoaderData();
    const [hidePitchIdeaButton, setHidePitchIdeaButton] = useState(loaderData.hidePictIdeaButton);

    const { proposals, pagination, loading } = useSelector((state) => state.proposals);
    const { user } = useSelector((state) => state.auth);
    const [pitchIdea, setPitchIdea] = useState(false);
    const [viewDetails, setViewDetails] = useState(null);
    const retrieve = useMemo(() => ({ proposalId: user._id }), [user._id]);

    useEffect(() => {
        const hasActiveProposal = proposals?.some(proposal => ['accepted', 'conditionallyAccepted', 'pending'].includes(proposal.status));
        if (hasActiveProposal) {
            setHidePitchIdeaButton(true);
        }
    }, [proposals]);

    return (
        <DashboardContent title='My Ideas' description='View and manage your project ideas'>
            <div className="flex justify-between items-center gap-5 p-2 mb-2">
                <h4 className="font-black text-theme mb-0">My Project Ideas</h4>
                {!hidePitchIdeaButton && (
                    <Button type="button" className="text-sm" onClick={() => setPitchIdea(!pitchIdea)}>
                        <FaLightbulb /> Pitch an idea
                    </Button>
                )}

                {hidePitchIdeaButton && (
                    <Button type="button" disabled={true} className="text-sm" >
                        <FaLightbulb /> Pitch an idea
                    </Button>
                )}
            </div>
            {pitchIdea && <CreateProposalForm isLoading={loading} closeForm={() => setPitchIdea(false)} />}

            {viewDetails && (
                <ViewProposalDetails
                    proposal={proposals.find(proposal => proposal._id == viewDetails)}
                    closeForm={(v) => setViewDetails(v && false)}
                />
            )}

            <DataTable
                empty="No project ideas are currently associated with your profile."
                onChange={retrieveManyProposal}
                retrieve={retrieve}
                recordList={proposals}
                paginationData={pagination}
                recordFields={{
                    title: "Title",
                    department: "department",
                    batch: "batch",
                    category: "Category",
                    type: "Type",
                }}
                actions={[
                    {
                        label: "View",
                        icon: <FaLightbulb />,
                        ShowWhen: { status: true },
                        onClick: (id) => setViewDetails(id)
                    },
                ]}
                searchableFields={{
                    title: "Title",
                    department: "department",
                    batch: "batch",
                    category: "Category",
                    type: "Type",
                }}
            />
        </DashboardContent >
    )
}

export default MyIdeas