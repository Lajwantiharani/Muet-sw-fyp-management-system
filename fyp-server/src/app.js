import { Router } from 'express';

import notificationRoutes from './routes/notification.routes.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import proposalRoutes from './routes/proposal.routes.js';
import projectRoutes from './routes/project.routes.js';
import presentationRoutes from './routes/presentation.routes.js';
import meetingRoutes from './routes/meeting.routes.js';
import pastFypRoutes from './routes/past.fyp.routes.js';

// registered routes
const apiRoutes = Router({ mergeParams: true });

// register routes
apiRoutes.use('/notifications', notificationRoutes);
apiRoutes.use('/auth', authRoutes);
apiRoutes.use('/users', userRoutes);
apiRoutes.use('/proposals', proposalRoutes);
apiRoutes.use('/projects', projectRoutes);
apiRoutes.use('/presentations', presentationRoutes);
apiRoutes.use('/meetings', meetingRoutes);
apiRoutes.use('/past-fyps', pastFypRoutes);
apiRoutes.use('/fyp-projects', pastFypRoutes);

// export to register
export default apiRoutes;
