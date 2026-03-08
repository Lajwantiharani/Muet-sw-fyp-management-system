import { Fragment, useEffect, useState } from 'react'
import { Button, ConfirmtionModal, Overlay } from '@components'
import { capEach, capitalize, firstLetter, formatDateTime, splitCamelCase } from '@utils'
import { readFile } from '@services'
import { deleteUser, updateStatus } from '@features'
import { FaLock, FaTrashAlt, FaUnlock, FaUserCheck, FaUserTimes } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { departments } from '@data'

const ViewUserDetails = ({ user, closeForm }) => {
    const dispatch = useDispatch()
    const { users } = useSelector((state) => state.users)

    const [src, setSrc] = useState(null)
    const [confirming, setConfirming] = useState(false)
    const [currentUser, setCurrentUser] = useState(user)

    useEffect(() => {
        const updated = users.find((u) => u._id === user._id)
        if (updated) {
            setCurrentUser(updated)
        }
    }, [users, user._id])

    useEffect(() => {
        (async () => {
            if (currentUser?.image) {
                setSrc(await readFile(currentUser.image).catch(() => null))
            }
        })()
    }, [currentUser.image])

    const handleDelete = async () => {
        const result = await dispatch(deleteUser(user._id))
        if (deleteUser.fulfilled.match(result)) {
            setConfirming(false); closeForm();
            return true;
        }
    }

    const handleApproveReject = async (id, statusCode) => {
        const result = await dispatch(updateStatus({ id, statusCode }));
        if (updateStatus.fulfilled.match(result)) {
            setConfirming(false); closeForm();
            return true;
        }
    }

    const handleLockUnlock = async (id, statusCode) => {
        const result = await dispatch(updateStatus({ id, statusCode }));
        if (updateStatus.fulfilled.match(result)) {
            setConfirming(false);
            return true;
        }

    }

    const FieldBlock = ({ label, value }) => (
        <div className="flex flex-col">
            <span className="text-xs text-secondary font-medium">{label}</span>
            <span className="text-sm text-primary font-semibold">{value ? value : '-'}</span>
        </div>
    )

    return (
        <Fragment>
            {confirming === "delete" && (
                <ConfirmtionModal
                    modalTitle="Delete Account"
                    prompt={`Deleting ${currentUser.role} account?`}
                    promptText="This action cannot be undone. Please confirm to proceed."
                    icon={<FaTrashAlt />}
                    buttonColor="button-danger"
                    confirmBtnText="Delete"
                    model="users"
                    onConfirm={handleDelete}
                    onClose={setConfirming}
                />
            )}

            {confirming === "reject" && (
                <ConfirmtionModal
                    modalTitle="Reject Registration"
                    prompt={`Rejecting ${currentUser.role} registration`}
                    promptText="This action will deny access. Please confirm to proceed."
                    icon={<FaUserTimes />}
                    buttonColor="button-danger"
                    confirmBtnText="Reject"
                    model="users"
                    onConfirm={() => handleApproveReject(currentUser._id, 20002)}
                    onClose={setConfirming}
                />
            )}

            {confirming === "approve" && (
                <ConfirmtionModal
                    modalTitle="Approve Registration"
                    prompt={`Approving ${currentUser.role} registration`}
                    promptText={`This will grant this ${currentUser.role} to access the FYP management system.`}
                    icon={<FaUserCheck />}
                    buttonColor="button-success"
                    confirmBtnText="Approve"
                    model="users"
                    onConfirm={() => handleApproveReject(currentUser._id, 20001)}
                    onClose={setConfirming}
                />
            )}

            {confirming === "lock" && (
                <ConfirmtionModal
                    modalTitle="Restrict Access"
                    prompt={`Restricting ${currentUser.role} account access`}
                    promptText={`This ${currentUser.role} will no longer be able to access the FYP management system.`}
                    icon={<FaLock />}
                    confirmBtnText="Restrict Access"
                    model="users"
                    onConfirm={() => handleLockUnlock(currentUser._id, 20003)}
                    onClose={setConfirming}
                />
            )}

            {confirming === "unlock" && (
                <ConfirmtionModal
                    modalTitle="Restore Access"
                    prompt={`Restore access for the ${currentUser.role} account.`}
                    promptText={`This ${currentUser.role} will regain access to the FYP management system.`}
                    icon={<FaUnlock />}
                    confirmBtnText="Restore Access"
                    model="users"
                    onConfirm={() => handleLockUnlock(currentUser._id, 20004)}
                    onClose={setConfirming}
                />
            )}

            <Overlay
                onClose={closeForm}
                title="Account Information"
                width="w-[90%] sm:w-[80%] md:w-[70%] lg:w-[50%]"
            >
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col sm:flex-row gap-4 bg-primary rounded-2xl items-stretch">
                        <div className="flex flex-col items-center gap-2 self-start sm:pr-2">
                            {src ? (
                                <img src={src} alt="User" className="w-32 h-32 rounded-full object-cover" />
                            ) : (
                                <div className="w-32 h-32 rounded-full flex items-center justify-center bg-secondary border border-primary text-secondary text-4xl">
                                    <strong>{firstLetter(currentUser.name)}</strong>
                                </div>
                            )}
                            <div className="text-center">
                                <p className="text-primary font-semibold">{capEach(currentUser.name)}</p>
                                <p className="text-secondary text-sm">{capitalize(currentUser.role)}</p>
                            </div>
                        </div>

                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FieldBlock label="Email" value={currentUser.email} />
                            <FieldBlock label="Phone" value={currentUser?.phone ?? '"-'} />
                            <FieldBlock label="CNIC" value={currentUser?.cnic ?? "-"} />
                            {user?.role != "admin" && (
                                <Fragment>
                                    <FieldBlock label="Department" value={departments?.find(d => d.abbreviation == currentUser.department)?.name ?? "-"} />
                                    {user?.role == "student" && (
                                        <>
                                            <FieldBlock label="Batch" value={currentUser?.batch ?? "-"} />
                                            <FieldBlock label="Shift" value={capitalize(currentUser?.shift ?? "-")} />
                                        </>
                                    )}
                                </Fragment>
                            )}
                            <FieldBlock label="Status" value={splitCamelCase(currentUser?.status ?? '-')} />
                            <FieldBlock label="Verified At" value={formatDateTime(currentUser.verifiedAt)} />
                            <FieldBlock label="Registered At" value={formatDateTime(currentUser.createdAt)} />
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-end gap-3">
                        {currentUser.status == "approvalPending" && (
                            <>
                                <Button className="text-sm button-success" onClick={() => setConfirming("approve")}>
                                    <FaUserCheck /> Approve
                                </Button>
                                <Button className="text-sm button-danger" onClick={() => setConfirming("reject")}>
                                    <FaUserTimes /> Reject
                                </Button>
                            </>
                        )}

                        {currentUser.status == "active" && (
                            <Button className="text-sm" onClick={() => setConfirming("lock")}>
                                <FaLock /> Restrict Access
                            </Button>
                        )}

                        {currentUser.status == "inactive" && (
                            <Button className="text-sm" onClick={() => setConfirming("unlock")}>
                                <FaUnlock /> Restore Access
                            </Button>
                        )}

                        {!["approvalPending"].includes(user?.status) && (
                            <Button className="text-sm button-danger" onClick={() => setConfirming("delete")}>
                                <FaTrashAlt /> Delete
                            </Button>
                        )}
                    </div>
                </div>
            </Overlay>
        </Fragment>
    )
}

export default ViewUserDetails
