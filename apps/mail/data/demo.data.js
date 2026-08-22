// mail demo data
// Timestamps are relative to load time so the date column always looks realistic
// (today -> "14:32", this year -> "Sep 12", older -> "12/09/2019")

const NOW = Date.now()
const MINUTE = 1000 * 60
const HOUR = MINUTE * 60
const DAY = HOUR * 24

const USER = 'user@appsus.com'
const USER_NAME = 'Mahatma Appsus'

// every mail carries the same twelve fields and differs in about five of them, so
// the rest are filled in here. opts: isRead, isStared, labels, isDraft, trashedAgo
function _mail(id, ago, fields) {
    const { isRead = true, isStared = false, labels = [], isDraft = false, trashedAgo = 0 } = fields
    const at = NOW - ago

    return {
        id,
        createdAt: at,
        // no sentAt is what puts a mail in Drafts, and removedAt must be null
        // rather than missing, or isInFolder reads it as trashed
        sentAt: isDraft ? null : at,
        removedAt: trashedAgo ? NOW - trashedAgo : null,
        from: fields.from,
        fromName: fields.fromName,
        to: fields.to,
        subject: fields.subject,
        body: fields.body,
        isRead,
        isStared,
        labels,
    }
}

// addressed to the logged in user - lands in Inbox unless it is trashed
function inbox(id, ago, from, fromName, subject, body, opts = {}) {
    return _mail(id, ago, { ...opts, from, fromName, to: USER, subject, body })
}

// from the logged in user - lands in Sent, or Drafts with { isDraft: true }
function sent(id, ago, to, subject, body, opts = {}) {
    return _mail(id, ago, { ...opts, from: USER, fromName: USER_NAME, to, subject, body })
}

export const demoMails = [

    // ---------------------------------------------------------------- inbox
    inbox('e101', 8 * MINUTE, 'tal@codingacademy.com', 'Tal Bar',
        'Standup moved to 10:15',
        'Pushing it back fifteen minutes, the room is taken until then. Same link.',
        { isRead: false, labels: ['work'] }),

    inbox('e102', 25 * MINUTE, 'notifications@github.com', 'GitHub',
        'Your pull request was approved',
        'Nice work on the filter refactor. I left two small comments about naming but nothing blocking - feel free to merge once CI goes green.',
        { isRead: false, labels: ['work'] }),

    inbox('e103', 40 * MINUTE, 'tracking@dhl.com', 'DHL Express',
        'Your package is out for delivery',
        'Parcel 4471-9920 is on the van and should reach you before 18:00 today. No signature needed.',
        { isRead: false }),

    inbox('e104', 1 * HOUR, 'dana@codingacademy.com', 'Dana Levi',
        'Design handoff for the compose modal',
        'Frames are ready in Figma. The header is 40px, not 48 - that was my mistake in the earlier version. Shout if the spacing tokens do not line up.',
        { isRead: false, isStared: true, labels: ['work'] }),

    inbox('e105', 2 * HOUR, 'momo@momo.com', 'Momo Cohen',
        'Are we still on for Friday?',
        'Just double checking about Friday night. I booked a table for four at 20:00 but I can move it if that is too late for you.',
        { isRead: false, isStared: true, labels: ['friends'] }),

    inbox('e106', 3 * HOUR, 'noreply@stackoverflow.com', 'Stack Overflow',
        'Your answer was accepted',
        'Someone marked your answer on "Why does useEffect run twice" as accepted. That is 15 reputation.',
        { labels: ['work'] }),

    inbox('e107', 5 * HOUR, 'security@bankofappsus.com', 'Bank of Appsus',
        'Unusual sign-in attempt blocked',
        'We blocked a sign-in to your account from a device we do not recognise in Frankfurt. If this was not you, change your password immediately.',
        { isRead: false, isStared: true, labels: ['critical'] }),

    inbox('e108', 6 * HOUR, 'reminders@calendar.com', 'Calendar',
        'Reminder: dentist tomorrow at 09:30',
        'Dr. Almog, 14 Herzl St. Please arrive ten minutes early to fill in the form.',
        { isRead: false }),

    inbox('e109', 9 * HOUR, 'info@netflix.com', 'Netflix',
        'New shows added to your list',
        'Three titles from your watchlist just arrived, plus a documentary we think you will actually finish this time.'),

    inbox('e110', 11 * HOUR, 'noreply@figma.com', 'Figma',
        'Dana Levi shared a file with you',
        '"misterEmail - compose" is now shared with you. You have edit access.',
        { labels: ['work'] }),

    inbox('e111', 14 * HOUR, 'deals@shoes.com', 'Shoes',
        '50% off your next order',
        'One weekend only. Everything in the outlet section is half price with code WEEKEND50.'),

    inbox('e112', 1 * DAY, 'asanir96@gmail.com', 'Asaf Nir',
        'Sprint 3 kickoff notes',
        'Attaching the notes from this morning. Each of us leads one app, we push and pull twice a day, and we review each other before submission. I took missKeep, you have misterEmail.',
        { isRead: false, isStared: true, labels: ['work', 'critical'] }),

    inbox('e113', 1 * DAY + 2 * HOUR, 'talent@wixel.com', 'Wixel Talent',
        'Interview invitation - Frontend Developer',
        'We liked your application and would like to set up a first call. Are you free any afternoon next week?',
        { isRead: false, isStared: true, labels: ['work', 'critical'] }),

    inbox('e114', 1 * DAY + 3 * HOUR, 'messages-noreply@linkedin.com', 'LinkedIn',
        'You have 4 new connection requests',
        'People in your network have been busy. See who wants to connect with you this week.'),

    inbox('e115', 1 * DAY + 5 * HOUR, 'billing@citywater.gov', 'City Water',
        'Water bill for August',
        'Your bill of 112.40 is due on the 9th. Usage is down 4% on the same period last year.'),

    inbox('e116', 1 * DAY + 8 * HOUR, 'no-reply@zoom.us', 'Zoom',
        'Your meeting recording is ready',
        'The recording of "Sprint 3 kickoff" is available for 30 days. Anyone with the link can watch it.',
        { labels: ['work'] }),

    inbox('e117', 2 * DAY, 'dad@family.com', 'Dad',
        'Grandma is asking about you again',
        'She called twice this week. Please ring her for ten minutes, you know how happy it makes her. Also she wants to know if you are eating properly.',
        { isStared: true, labels: ['family'] }),

    inbox('e118', 2 * DAY + 4 * HOUR, 'booking@flyappsus.com', 'Fly Appsus',
        'Your flight to Berlin is confirmed',
        'AP442, Tuesday 06:35 from Terminal 3. Check-in opens 24 hours before departure.',
        { isStared: true }),

    inbox('e119', 2 * DAY + 9 * HOUR, 'security@github.com', 'GitHub',
        'New login from Chrome on Windows',
        'We noticed a new sign-in to your account. If this was you, no action is needed.',
        { labels: ['work'] }),

    inbox('e120', 3 * DAY, 'orders@shoes.com', 'Shoes',
        'Your order has shipped',
        'Order #A-99213 left our warehouse and is on its way. Estimated delivery Thursday between 09:00 and 18:00.'),

    inbox('e121', 3 * DAY + 6 * HOUR, 'office@codingacademy.com', 'Coding Academy Office',
        'Team lunch on Thursday',
        'We are ordering in at 13:00. Reply with what you want by Wednesday evening or you get the default falafel.',
        { labels: ['work'] }),

    inbox('e122', 4 * DAY, 'claims@totally-legit-lottery.biz', 'International Lottery Board',
        'CONGRATULATIONS!!! You have won',
        'Dear winner, you have been selected among 4,000,000 email addresses to receive a prize of $950,000. Reply with your bank details within 48 hours.',
        { isRead: false, labels: ['spam'] }),

    inbox('e123', 4 * DAY + 5 * HOUR, 'noa@friends.com', 'Noa Shani',
        'Weekend plans?',
        'A few of us are going up north Saturday morning. There is room in the car if you want in.',
        { isRead: false, isStared: true, labels: ['friends'] }),

    inbox('e124', 5 * DAY, 'momo@momo.com', 'Momo Cohen',
        'Can you look at this bug?',
        'The date column shows the wrong year for anything before 2020. I have not touched that code, so I assume it is the formatter.',
        { isRead: false, labels: ['work'] }),

    inbox('e125', 5 * DAY + 7 * HOUR, 'landlord@apartments.com', 'Rami Ben-Ari',
        'Rent for September',
        'Same amount as last month. Please transfer by the 5th so I can pay the building fee on time.',
        { isStared: true, labels: ['critical'] }),

    inbox('e126', 6 * DAY, 'yaron@codingacademy.com', 'Yaron Biton',
        'Code review: mail service structure',
        'Deriving the folder from removedAt and sentAt instead of storing it is the right call - you can never end up with a mail in two places. One note: escape the search text before you build a RegExp.',
        { isStared: true, labels: ['work'] }),

    inbox('e127', 6 * DAY + 4 * HOUR, 'billing@spotify.com', 'Spotify',
        'Your subscription payment failed',
        'We could not charge the card ending 4471. Update your payment details within seven days to keep Premium.',
        { isRead: false, labels: ['critical'] }),

    inbox('e128', 7 * DAY, 'mom@family.com', 'Mom',
        'Photos of the dog',
        'He got a haircut and he is furious about it. Attaching four pictures, look at the third one.',
        { isStared: true, labels: ['family'] }),

    inbox('e129', 7 * DAY + 8 * HOUR, 'noreply@duolingo.com', 'Duolingo',
        'Your 40 day streak is at risk',
        'You have not practised today. Five minutes is all it takes to keep the streak alive.'),

    inbox('e130', 8 * DAY, 'hello@frontendweekly.dev', 'Frontend Weekly',
        'Frontend Weekly #49',
        'This week: five CSS features you are probably not using, an interview about state management, and the usual round-up of things that broke.'),

    inbox('e131', 9 * DAY, 'billing@hostinger.com', 'Hostinger Billing',
        'Invoice #2291 is due in 3 days',
        'A reminder that invoice #2291 for 249.00 is due on the 14th. Pay online or reply if you need a different arrangement.',
        { isStared: true, labels: ['critical'] }),

    inbox('e132', 9 * DAY + 6 * HOUR, 'service@garage.com', 'Kfir Garage',
        'Your car service is due',
        'It has been 14 months since the last one. We have slots free the week after next, mornings only.'),

    inbox('e133', 10 * DAY, 'noreply@linkedin.com', 'LinkedIn',
        'Congrats on 2 years at Coding Academy',
        'Your network wants to celebrate with you. Share an update about the milestone.'),

    inbox('e134', 11 * DAY, 'gal@pal.com', 'Gal Peled',
        'That restaurant we talked about',
        'It is called Bardak, on Levontin. They do not take reservations for fewer than six so we just have to turn up early.',
        { labels: ['friends'] }),

    inbox('e135', 12 * DAY, 'teach@codingacademy.com', 'Coding Academy',
        'Course materials for week 8',
        'Slides and the exercise repo are up. Week 8 is React Router and URL state, which is directly relevant to your sprint.',
        { isStared: true, labels: ['work'] }),

    inbox('e136', 13 * DAY, 'support@app-sus-verify.ru', 'Account Services',
        'URGENT: verify your account now',
        'Your account will be permanently deleted in 24 hours unless you confirm your identity at the link below.',
        { isRead: false, labels: ['spam'] }),

    inbox('e137', 14 * DAY, 'noreply@npmjs.com', 'npm',
        'A package you depend on has a security advisory',
        'A moderate severity vulnerability was found in one of your dependencies. A patched version is available.',
        { labels: ['work'] }),

    inbox('e138', 15 * DAY, 'hr@codingacademy.com', 'Coding Academy HR',
        'Payslip for last month',
        'Your payslip is attached as a password protected PDF. The password is your ID number.',
        { isStared: true }),

    inbox('e139', 16 * DAY, 'gal@pal.com', 'Gal Peled',
        'Photos from the trip',
        'Finally went through all of them. About 400, so I put the good ones in a shared album. Warning: there is one of you asleep on the bus.',
        { isStared: true, labels: ['friends', 'memories'] }),

    inbox('e140', 17 * DAY, 'club@readers.org', 'Tuesday Book Club',
        'Next pick: Piranesi',
        'We are meeting on the 24th at Noa place. About 250 pages, so no excuses this time.'),

    inbox('e141', 18 * DAY, 'noreply@steampowered.com', 'Steam',
        'Items on your wishlist are on sale',
        'Three games you are watching dropped in price. The sale ends Monday at 18:00.'),

    inbox('e142', 19 * DAY, 'hero@momo.com', 'Hero Levi',
        'Football on Wednesday',
        'We are two short. Half seven at the usual pitch, bring a white shirt and a dark one.',
        { labels: ['friends'] }),

    inbox('e143', 20 * DAY, 'hello@powerco.com', 'PowerCo',
        'Your electricity usage went up 12%',
        'Compared with the same month last year. The dashboard breaks it down by day if you want to see where it went.'),

    inbox('e144', 21 * DAY, 'tal@codingacademy.com', 'Tal Bar',
        'Retro notes',
        'Summary of what we said: less scope per sprint, review earlier, and stop merging on Fridays after 17:00.',
        { isStared: true, labels: ['work'] }),

    inbox('e145', 22 * DAY, 'noreply@paypal.com', 'PayPal',
        'You sent a payment of 34.90',
        'To Bardak Restaurant. It may take a few minutes to appear in your activity.'),

    inbox('e146', 23 * DAY, 'info@gym-central.com', 'Gym Central',
        'Your membership renews next week',
        'The annual plan renews on the 1st at the current rate. Nothing to do unless you want to change tier.'),

    inbox('e147', 24 * DAY, 'team@shelter.org', 'Animal Shelter',
        'Thanks for volunteering',
        'Saturday went really well, we rehomed four of them. Same time next month if you are free.',
        { isStared: true }),

    inbox('e148', 26 * DAY, 'asanir96@gmail.com', 'Asaf Nir',
        'Are you touching vars.css?',
        'I need to add the note colour tokens but I do not want to collide with you. Tell me when you are done with it.',
        { labels: ['work'] }),

    inbox('e149', 28 * DAY, 'noreply@airbnb.com', 'Airbnb',
        'Your stay in Berlin is coming up',
        'Check in is from 15:00. Your host Katja has sent directions from the station.',
        { isStared: true }),

    inbox('e150', 30 * DAY, 'library@city.gov', 'City Library',
        'Two items are due back Friday',
        'Renew online if nobody else has reserved them. Late returns are 2.00 per week per item.'),

    inbox('e151', 32 * DAY, 'dana@codingacademy.com', 'Dana Levi',
        'Colour tokens, second pass',
        'I pulled the greys off the real thing with the eyedropper. The read row is not white, it is a very slightly blue grey, which is the whole read/unread cue.',
        { labels: ['work'] }),

    inbox('e152', 34 * DAY, 'no-reply@spotify.com', 'Spotify',
        'Your subscription renews soon',
        'Your annual plan renews on the 1st of next month. We will charge the card ending 4471.'),

    inbox('e153', 36 * DAY, 'noa@friends.com', 'Noa Shani',
        'Did you leave a jacket here?',
        'Grey, too big for anyone who was here. I assume it is yours. It is on the chair by the door.',
        { labels: ['friends'] }),

    inbox('e154', 38 * DAY, 'insurance@shieldco.com', 'ShieldCo Insurance',
        'Your policy documents',
        'Attached are the renewal documents for the coming year. The excess is unchanged at 1,200.',
        { isStared: true, labels: ['critical'] }),

    inbox('e155', 40 * DAY, 'yaron@codingacademy.com', 'Yaron Biton',
        'On naming things',
        'Read your service again. isInFolder is doing real work and reads well. Keep going in that direction and stop apologising for long function names.',
        { isStared: true, labels: ['work'] }),

    inbox('e156', 43 * DAY, 'dad@family.com', 'Dad',
        'The car needs a new battery',
        'It would not start this morning. I have sorted it, but if you borrow it next week, do not leave the lights on.',
        { labels: ['family'] }),

    inbox('e157', 45 * DAY, 'hero@momo.com', 'Hero Levi',
        'Save the date',
        'We are doing it on the 12th of next spring. Proper invitation to follow, but block the weekend now.',
        { isStared: true, labels: ['friends', 'memories'] }),

    inbox('e158', 47 * DAY, 'noreply@uber.com', 'Uber',
        'Your Thursday morning trip receipt',
        '18.50 for a 12 minute trip. Your driver was Eli in a white Corolla.'),

    inbox('e159', 50 * DAY, 'office@codingacademy.com', 'Coding Academy Office',
        'Building access on the weekend',
        'The side door is locked from Friday 16:00. Use the main entrance and the code from the group chat.',
        { labels: ['work'] }),

    inbox('e160', 53 * DAY, 'pharmacy@health.co', 'Central Pharmacy',
        'Your prescription is ready',
        'Ready for collection until the end of next week, after which it goes back on the shelf.'),

    inbox('e161', 56 * DAY, 'gal@pal.com', 'Gal Peled',
        'Playlist for the drive',
        'Four hours long, which is about ninety minutes more than the drive. No skipping.',
        { labels: ['friends', 'memories'] }),

    inbox('e162', 60 * DAY, 'renewals@hostinger.com', 'Hostinger',
        'Your domain expires in 30 days',
        'Renew before the expiry date to avoid the redemption fee, which is considerably more than the renewal.',
        { isStared: true, labels: ['critical'] }),

    inbox('e163', 63 * DAY, 'tal@codingacademy.com', 'Tal Bar',
        'Pairing tomorrow?',
        'I am stuck on the router setup and you have clearly worked it out. An hour would probably do it.',
        { isStared: true, labels: ['work'] }),

    inbox('e164', 67 * DAY, 'noreply@slack.com', 'Slack',
        'You have 12 unread mentions',
        'Catch up on what happened in #frontend and #sprint-3 while you were away.',
        { labels: ['work'] }),

    inbox('e165', 70 * DAY, 'hero@momo.com', 'Hero Levi',
        'Happy birthday!',
        'Another year, still the same terrible taste in music. Drinks are on me whenever you are free.',
        { isStared: true, labels: ['friends', 'memories'] }),

    inbox('e166', 73 * DAY, 'mom@family.com', 'Mom',
        'Recipe you asked for',
        'It is half a kilo of tomatoes, not a kilo. That is where it went wrong last time.',
        { isStared: true, labels: ['family'] }),

    inbox('e167', 77 * DAY, 'deals@aliexpress.com', 'AliExpress',
        'Items in your cart are selling out',
        'Three of the four things you left in your basket are low on stock.'),

    inbox('e168', 80 * DAY, 'noreply@booking.com', 'Booking.com',
        'How was your stay?',
        'Leave a review for Pension Adler and help other travellers decide. It takes two minutes.'),

    inbox('e169', 85 * DAY, 'asanir96@gmail.com', 'Asaf Nir',
        'Repo is up',
        'HorizonChess/Appsus, you should have the invite. I pushed the starter with the babel loader already wired.',
        { isStared: true, labels: ['work'] }),

    inbox('e170', 90 * DAY, 'momo@momo.com', 'Momo Cohen',
        'Thanks for the other night',
        'Genuinely needed that. Next one is on me, and I mean it this time.',
        { labels: ['friends'] }),

    inbox('e171', 95 * DAY, 'billing@citywater.gov', 'City Water',
        'Meter reading required',
        'We could not access the meter on our last visit. Submit a reading online or we will estimate.'),

    inbox('e172', 100 * DAY, 'dana@codingacademy.com', 'Dana Levi',
        'Portfolio feedback',
        'The work is good but the case studies bury it. Lead with the outcome, then the process.',
        { isStared: true, labels: ['work'] }),

    inbox('e173', 110 * DAY, 'noreply@github.com', 'GitHub',
        'Your yearly contribution summary',
        'You opened 84 pull requests and reviewed 61 this year. Most active month was March.',
        { labels: ['work', 'memories'] }),

    inbox('e174', 120 * DAY, 'gal@pal.com', 'Gal Peled',
        'Trip receipts',
        'Splitting it out: fuel 420, cabin 1,100, food roughly 300. You already covered the fuel.',
        { labels: ['friends', 'memories'] }),

    inbox('e175', 130 * DAY, 'dentist@almog.co', 'Dr. Almog',
        'Six month check-up',
        'You are due. Reply with two or three times that suit you and we will fit you in.'),

    inbox('e176', 140 * DAY, 'noa@friends.com', 'Noa Shani',
        'Moving flat',
        'The 3rd, if you are around and have a strong back. There is pizza in it for you.',
        { labels: ['friends'] }),

    inbox('e177', 150 * DAY, 'hr@codingacademy.com', 'Coding Academy HR',
        'Annual leave balance',
        'You have 14 days left and 4 of them expire at the end of the year. Use them or lose them.',
        { isStared: true }),

    inbox('e178', 165 * DAY, 'crypto-opportunity@fastgains.io', 'Investment Desk',
        'Turn 500 into 50,000 this month',
        'Our proprietary algorithm has a 97% success rate. Limited places available for new investors.',
        { isRead: false, labels: ['spam'] }),

    inbox('e179', 180 * DAY, 'yaron@codingacademy.com', 'Yaron Biton',
        'Reading list',
        'Start with Refactoring, then A Philosophy of Software Design. Skip the third one until you have written more code.',
        { isStared: true, labels: ['work'] }),

    inbox('e180', 195 * DAY, 'noreply@netflix.com', 'Netflix',
        'Your password was changed',
        'If you did not make this change, secure your account immediately.'),

    inbox('e181', 210 * DAY, 'dad@family.com', 'Dad',
        'Old photos, scanned',
        'I got the box from the loft digitised. There is one of you aged four covered in paint that I am not deleting.',
        { isStared: true, labels: ['family', 'memories'] }),

    inbox('e182', 225 * DAY, 'club@readers.org', 'Tuesday Book Club',
        'Welcome to the club',
        'First meeting is on the 8th. Read the first hundred pages, or at least enough to bluff it.'),

    inbox('e183', 240 * DAY, 'office@codingacademy.com', 'Coding Academy Office',
        'Your desk has moved',
        'You are now by the window on the second floor. Your things are in a box under the new desk.',
        { labels: ['work'] }),

    inbox('e184', 260 * DAY, 'momo@momo.com', 'Momo Cohen',
        'New phone, same number',
        'Old one died in a puddle. Resend anything I did not reply to in the last week.',
        { labels: ['friends'] }),

    inbox('e185', 280 * DAY, 'service@garage.com', 'Kfir Garage',
        'Service completed',
        'Oil, filters and both front tyres. The rear ones will need doing in about eight months.'),

    inbox('e186', 300 * DAY, 'talent@bytehouse.io', 'ByteHouse Recruiting',
        'A role that might suit you',
        'Mid-level frontend, hybrid, three days in the office. Happy to send the full spec if you are curious.',
        { labels: ['work'] }),

    inbox('e187', 330 * DAY, 'mom@family.com', 'Mom',
        'Your grandmother turns 90',
        'We are doing lunch on the Saturday. She does not want presents, which we are all ignoring.',
        { isStared: true, labels: ['family'] }),

    inbox('e188', 365 * DAY, 'noreply@spotify.com', 'Spotify',
        'Your year in review',
        'You listened for 41,000 minutes. Your top artist will not surprise you at all.',
        { labels: ['memories'] }),

    inbox('e189', 400 * DAY, 'dev@previousjob.com', 'Ronen Katz',
        'Old project handover',
        'Everything is in the wiki, such as it is. The deploy script has a hardcoded path in it that I never fixed. Sorry.',
        { labels: ['work'] }),

    inbox('e190', 430 * DAY, 'hero@momo.com', 'Hero Levi',
        'Are you free in August?',
        'Thinking Greece, roughly a week, four or five of us. Say yes before you think about it too hard.',
        { labels: ['friends', 'memories'] }),

    inbox('e191', 470 * DAY, 'admin@previousjob.com', 'IT Admin',
        'Your account has been deactivated',
        'As of your last working day. Anything in your personal drive was archived and will be kept for a year.'),

    inbox('e192', 510 * DAY, 'gal@pal.com', 'Gal Peled',
        'Congratulations!',
        'Heard you got it. Completely deserved and I want to hear everything on Thursday.',
        { isStared: true, labels: ['friends', 'memories'] }),

    inbox('e193', 550 * DAY, 'hr@previousjob.com', 'People Team',
        'Your final payslip',
        'Includes the untaken leave. Reference letter is attached separately, as promised.',
        { labels: ['memories'] }),

    inbox('e194', 600 * DAY, 'noreply@linkedin.com', 'LinkedIn',
        'Your profile appeared in 46 searches',
        'Mostly from recruiters in the software sector. See what they were looking for.'),

    inbox('e195', 640 * DAY, 'dad@family.com', 'Dad',
        'Insurance for the flat',
        'You need contents cover, not just building. Ask them about the bike specifically, it is usually excluded.',
        { labels: ['family'] }),

    inbox('e196', 690 * DAY, 'lettings@apartments.com', 'Rami Ben-Ari',
        'Keys and the inventory',
        'Signed copy attached. The scratch on the kitchen door was already noted, so do not worry about it.',
        { isStared: true, labels: ['memories'] }),

    inbox('e197', 730 * DAY, 'teach@codingacademy.com', 'Coding Academy',
        'You are in',
        'Congratulations, you have a place on the full-time course starting in October. Details and the reading list to follow.',
        { isStared: true, labels: ['work', 'memories'] }),

    inbox('e198', 760 * DAY, 'noa@friends.com', 'Noa Shani',
        'That job you were unsure about',
        'Take it. The worst case is you learn what you do not want, and you are twenty-six, not sixty.',
        { labels: ['friends'] }),

    inbox('e199', 790 * DAY, 'support@oldbank.com', 'Old Bank',
        'Account closure confirmed',
        'Your account was closed on request and the balance transferred. Statements stay available for seven years.'),

    inbox('e200', 800 * DAY, 'welcome@appsus.com', 'Appsus Team',
        'Welcome to Appsus',
        'Thanks for signing up. Your account is ready and this is the very first message in your inbox. Keep it around - one day it will be nostalgic.',
        { labels: ['memories'] }),

    inbox('e201', 830 * DAY, 'mom@family.com', 'Mom',
        'Do you have enough plates?',
        'A simple question. You have not answered it in four days, so I am assuming no and bringing some.',
        { labels: ['family', 'memories'] }),

    inbox('e202', 860 * DAY, 'movers@lifthigh.com', 'LiftHigh Movers',
        'Quote for your move',
        'Two men and a van, four hours, 950 including the packing materials. Valid for thirty days.'),

    inbox('e203', 890 * DAY, 'momo@momo.com', 'Momo Cohen',
        'The flat on Levontin',
        'It is small and the kitchen is a disgrace, but the location is unbeatable and you know it.',
        { labels: ['friends', 'memories'] }),

    inbox('e204', 920 * DAY, 'hero@momo.com', 'Hero Levi',
        'Ten years of this nonsense',
        'Someone reminded me it has been a decade since we met at that awful party. Still the best thing to come out of it.',
        { isStared: true, labels: ['friends', 'memories'] }),

    inbox('e205', 980 * DAY, 'noreply@github.com', 'GitHub',
        'Welcome to GitHub',
        'Your account is ready. Here are a few things to try first, most of which you will ignore.',
        { labels: ['work', 'memories'] }),

    // ----------------------------------------------------------------- sent
    sent('e206', 5 * MINUTE, 'tal@codingacademy.com',
        'Re: Standup moved to 10:15',
        'Works for me. I will have the pagination done by then so there is something to show.',
        { labels: ['work'] }),

    sent('e207', 50 * MINUTE, 'dana@codingacademy.com',
        'Re: Design handoff for the compose modal',
        'Got it, 40px header. The spacing tokens line up everywhere except the footer, which I will fix rather than bother you about.',
        { isStared: true, labels: ['work'] }),

    sent('e208', 3 * HOUR, 'asanir96@gmail.com',
        'Re: Sprint 3 kickoff notes',
        'Sounds good. I will take misterEmail and get the service done first so there is real data to build the UI against.',
        { labels: ['work'] }),

    sent('e209', 7 * HOUR, 'security@bankofappsus.com',
        'Re: Unusual sign-in attempt blocked',
        'That was not me. I have changed the password and enabled the second factor. Please confirm nothing was accessed.',
        { isStared: true, labels: ['critical'] }),

    sent('e210', 12 * HOUR, 'noa@friends.com',
        'Re: Weekend plans?',
        'In, if there is genuinely room. I can drive part of the way if that helps.',
        { labels: ['friends'] }),

    sent('e211', 1 * DAY, 'talent@wixel.com',
        'Re: Interview invitation - Frontend Developer',
        'Thank you, I would be glad to. Tuesday or Thursday afternoon both work, any time after 14:00.',
        { isStared: true, labels: ['work'] }),

    sent('e212', 1 * DAY + 6 * HOUR, 'momo@momo.com',
        'Re: Are we still on for Friday?',
        'Friday works. 20:00 is fine, do not move it. I might be five minutes late coming from the office.',
        { labels: ['friends'] }),

    sent('e213', 2 * DAY, 'dad@family.com',
        'Re: Grandma is asking about you again',
        'Calling her Sunday morning, before lunch. And yes, I am eating properly.',
        { labels: ['family'] }),

    sent('e214', 2 * DAY + 5 * HOUR, 'momo@momo.com',
        'Re: Can you look at this bug?',
        'Found it. The formatter compared getFullYear against the wrong date object. One line, pushed.',
        { isStared: true, labels: ['work'] }),

    sent('e215', 3 * DAY, 'office@codingacademy.com',
        'Re: Team lunch on Thursday',
        'Falafel is fine, but please no tahini on mine this time.',
        { labels: ['work'] }),

    sent('e216', 4 * DAY, 'yaron@codingacademy.com',
        'Re: Code review: mail service structure',
        'Appreciate the notes, especially escaping the search text - I would have shipped that straight to production. Fixed and pushed.',
        { labels: ['work'] }),

    sent('e217', 5 * DAY, 'billing@hostinger.com',
        'Question about the missing invoice',
        'I was charged twice for invoice #2288 last month but only got one receipt. Could you check on your side?',
        { isStared: true, labels: ['critical'] }),

    sent('e218', 6 * DAY, 'landlord@apartments.com',
        'Re: Rent for September',
        'Transferred this morning, reference is your surname and the flat number. Let me know it landed.'),

    sent('e219', 7 * DAY, 'mom@family.com',
        'Re: Photos of the dog',
        'The third one is outstanding. He looks personally betrayed. Send more.',
        { labels: ['family'] }),

    sent('e220', 8 * DAY, 'billing@spotify.com',
        'Re: Your subscription payment failed',
        'Card details updated. Please confirm the charge went through so I do not lose the account.'),

    sent('e221', 9 * DAY, 'service@garage.com',
        'Re: Your car service is due',
        'Tuesday the week after next, first thing if you have it. I can leave it with you for the day.'),

    sent('e222', 11 * DAY, 'gal@pal.com',
        'Re: That restaurant we talked about',
        'Bardak it is. I will get there at seven and hold a corner of a table with my body if necessary.',
        { labels: ['friends'] }),

    sent('e223', 12 * DAY, 'teach@codingacademy.com',
        'Question on week 8',
        'For URL state, is there a reason to prefer a data router here? We are on 6.3 and I do not think we can.',
        { labels: ['work'] }),

    sent('e224', 14 * DAY, 'tal@codingacademy.com',
        'Router notes',
        'Writing up what I worked out about useSearchParams so you do not have to rediscover it. The setter takes a value, not an updater, which matters more than it sounds.',
        { isStared: true, labels: ['work'] }),

    sent('e225', 16 * DAY, 'gal@pal.com',
        'Re: Photos from the trip',
        'Delete the bus one. I am asking nicely and I will not ask nicely again.',
        { labels: ['friends'] }),

    sent('e226', 18 * DAY, 'club@readers.org',
        'Re: Next pick: Piranesi',
        'Already read it, happy to do it again. I will keep quiet about the middle section.'),

    sent('e227', 19 * DAY, 'hero@momo.com',
        'Re: Football on Wednesday',
        'Count me in. I have exactly one white shirt left and it is barely white.',
        { labels: ['friends'] }),

    sent('e228', 21 * DAY, 'tal@codingacademy.com',
        'Re: Retro notes',
        'Agreed on all three, particularly the Friday one. That is how we got last month.',
        { labels: ['work'] }),

    sent('e229', 24 * DAY, 'team@shelter.org',
        'Re: Thanks for volunteering',
        'Put me down for next month. Saturdays are easier for me than Sundays.'),

    sent('e230', 26 * DAY, 'asanir96@gmail.com',
        'Re: Are you touching vars.css?',
        'I am about to expand it a lot. Give me until Thursday and then it is all yours.',
        { isStared: true, labels: ['work'] }),

    sent('e231', 29 * DAY, 'noreply@airbnb.com',
        'Question for the host',
        'Is there somewhere to leave bags before check-in? We land at 07:00 and cannot get in until three.'),

    sent('e232', 31 * DAY, 'library@city.gov',
        'Renewal request',
        'Both items please, if nobody has reserved them. I am about a third of the way through the second one.'),

    sent('e233', 33 * DAY, 'dana@codingacademy.com',
        'Re: Colour tokens, second pass',
        'The blue-grey was the missing piece. Rows read correctly now without any extra weight on the text.',
        { labels: ['work'] }),

    sent('e234', 36 * DAY, 'noa@friends.com',
        'Re: Did you leave a jacket here?',
        'That is mine. Do not let anyone wear it ironically, I will know.',
        { labels: ['friends'] }),

    sent('e235', 39 * DAY, 'insurance@shieldco.com',
        'Re: Your policy documents',
        'Can you confirm the bike is covered away from the property? The wording is ambiguous to me.',
        { isStared: true, labels: ['critical'] }),

    sent('e236', 41 * DAY, 'yaron@codingacademy.com',
        'Re: On naming things',
        'Taking that to heart. I have stopped shortening things to save eight characters nobody was counting.',
        { labels: ['work'] }),

    sent('e237', 44 * DAY, 'dad@family.com',
        'Re: The car needs a new battery',
        'Noted, lights off. Thank you for sorting it, I will fill the tank before I bring it back.',
        { labels: ['family'] }),

    sent('e238', 46 * DAY, 'hero@momo.com',
        'Re: Save the date',
        'Blocked out. Genuinely thrilled for you both and I expect a job in the speeches.',
        { isStared: true, labels: ['friends'] }),

    sent('e239', 51 * DAY, 'office@codingacademy.com',
        'Re: Building access on the weekend',
        'Understood. Is the code the same one from last term or has it rotated?',
        { labels: ['work'] }),

    sent('e240', 57 * DAY, 'gal@pal.com',
        'Re: Playlist for the drive',
        'Four hours is a threat, not a playlist. I am bringing my own for the way back.',
        { labels: ['friends'] }),

    sent('e241', 61 * DAY, 'renewals@hostinger.com',
        'Re: Your domain expires in 30 days',
        'Renewed for two years. Please turn off auto-renew notifications, I have it in my calendar now.'),

    sent('e242', 64 * DAY, 'tal@codingacademy.com',
        'Re: Pairing tomorrow?',
        'Tomorrow at 11 works. Bring the error, not a description of the error.',
        { labels: ['work'] }),

    sent('e243', 71 * DAY, 'hero@momo.com',
        'Re: Happy birthday!',
        'My taste in music is a gift you are simply not ready for. Taking you up on those drinks.',
        { labels: ['friends'] }),

    sent('e244', 74 * DAY, 'mom@family.com',
        'Re: Recipe you asked for',
        'Half a kilo. That explains a great deal about last time. Trying again Sunday.',
        { labels: ['family'] }),

    sent('e245', 86 * DAY, 'asanir96@gmail.com',
        'Re: Repo is up',
        'Cloned it. The babel loader is doing something clever with sync XHR that I want to understand before I add files.',
        { labels: ['work'] }),

    sent('e246', 91 * DAY, 'momo@momo.com',
        'Re: Thanks for the other night',
        'Any time, and I am holding you to that. Same place in a fortnight?',
        { labels: ['friends'] }),

    sent('e247', 96 * DAY, 'billing@citywater.gov',
        'Meter reading',
        'Reading is 04821 as of this morning. Photo attached in case the number is hard to read.'),

    sent('e248', 101 * DAY, 'dana@codingacademy.com',
        'Re: Portfolio feedback',
        'Rewrote all three case studies to lead with the outcome. Much shorter and much better. Thank you.',
        { isStared: true, labels: ['work'] }),

    sent('e249', 121 * DAY, 'gal@pal.com',
        'Re: Trip receipts',
        'That maths works. Sending my half of the cabin now, keep the food, it evens out.',
        { labels: ['friends'] }),

    sent('e250', 131 * DAY, 'dentist@almog.co',
        'Re: Six month check-up',
        'Any weekday after 16:00 works, or Friday morning if you have something early.'),

    sent('e251', 141 * DAY, 'noa@friends.com',
        'Re: Moving flat',
        'I will be there at nine. My back is fine, the pizza is non-negotiable.',
        { labels: ['friends'] }),

    sent('e252', 151 * DAY, 'hr@codingacademy.com',
        'Re: Annual leave balance',
        'Booking the four expiring days over the last week of December. Form submitted.'),

    sent('e253', 181 * DAY, 'yaron@codingacademy.com',
        'Re: Reading list',
        'Halfway through Refactoring and already rewriting things I finished last month. Not sure whether to thank you.',
        { isStared: true, labels: ['work'] }),

    sent('e254', 211 * DAY, 'dad@family.com',
        'Re: Old photos, scanned',
        'The paint one goes in a frame. I am not negotiating on this either.',
        { isStared: true, labels: ['family', 'memories'] }),

    sent('e255', 261 * DAY, 'momo@momo.com',
        'Re: New phone, same number',
        'Resent the two you missed. One was about football and one was important, guess which you replied to.',
        { labels: ['friends'] }),

    sent('e256', 301 * DAY, 'talent@bytehouse.io',
        'Re: A role that might suit you',
        'Send the spec through. I am not looking, but I am curious, which is how these things start.',
        { labels: ['work'] }),

    sent('e257', 331 * DAY, 'mom@family.com',
        'Re: Your grandmother turns 90',
        'I will be there. Ignoring the no-presents rule along with everyone else.',
        { isStared: true, labels: ['family'] }),

    sent('e258', 401 * DAY, 'dev@previousjob.com',
        'Re: Old project handover',
        'Found the hardcoded path within about four minutes. No hard feelings, it is documented now.',
        { labels: ['work'] }),

    sent('e259', 731 * DAY, 'teach@codingacademy.com',
        'Re: You are in',
        'Thank you - I have been refreshing my inbox for two weeks. Starting the reading this weekend.',
        { isStared: true, labels: ['work', 'memories'] }),

    sent('e260', 761 * DAY, 'noa@friends.com',
        'Re: That job you were unsure about',
        'Took it. You were right, which I will deny having said if you bring it up.',
        { isStared: true, labels: ['friends', 'memories'] }),

    // ---------------------------------------------------------------- draft
    sent('e261', 20 * MINUTE, '',
        'Questions for the retro',
        'Three things I want to raise: the Friday merges, how we split the shared css files, and whether the daily is still worth half an hour.',
        { isDraft: true, labels: ['work'] }),

    sent('e262', 45 * MINUTE, '',
        'Notes on the compose autosave',
        'Reminder to self: the first autosave has no id, so post() assigns one - capture it into state or you create a brand new draft every five seconds.',
        { isDraft: true, labels: ['work'] }),

    sent('e263', 2 * DAY, 'talent@wixel.com',
        'Re: Interview invitation - Frontend Developer',
        'Following up on availability - I could also do Monday morning if that is easier on your side. Actually, wait for them to reply first.',
        { isDraft: true, labels: ['work'] }),

    sent('e264', 6 * DAY, 'noa@friends.com',
        '',
        'Been meaning to write this for weeks and I still do not know how to start it. Maybe',
        { isDraft: true }),

    sent('e265', 8 * DAY, 'yaron@codingacademy.com',
        'Feedback on the sprint',
        'Honest version: the pairing sessions were the most useful part and there were not enough of them. Softening this before I send it.',
        { isDraft: true, labels: ['work'] }),

    sent('e266', 26 * DAY, 'dad@family.com',
        'About the summer',
        'I do not think I can make the whole two weeks this year, and I want to explain why properly rather than in a text.',
        { isDraft: true, labels: ['family'] }),

    sent('e267', 40 * DAY, '',
        'Ideas for the portfolio rewrite',
        'Lead with outcomes. Three projects, not seven. Kill the skills bar chart, nobody has ever believed a skills bar chart.',
        { isDraft: true }),

    sent('e268', 120 * DAY, 'hero@momo.com',
        'Speech notes',
        'Open with the party. Do not mention the car. Land on the bit about ten years and sit down before it gets embarrassing.',
        { isDraft: true, isStared: true, labels: ['friends'] }),

    // ---------------------------------------------------------------- trash
    inbox('e269', 2 * DAY, 'deals@aliexpress.com', 'AliExpress',
        'Flash sale ends tonight',
        'Our biggest sale of the season ends at midnight. Everything must go, and we do mean everything.',
        { trashedAgo: 1 * DAY, labels: ['spam'] }),

    inbox('e270', 4 * DAY, 'cart@shoes.com', 'Shoes',
        'You left something in your cart',
        'Your basket is waiting. We held the size for you, but not for much longer.',
        { trashedAgo: 3 * DAY }),

    inbox('e271', 6 * DAY, 'noreply@socialapp.com', 'SocialApp',
        'See what you missed this week',
        'Eleven people you may know joined, and there is activity in three groups you muted a year ago.',
        { trashedAgo: 5 * DAY }),

    inbox('e272', 9 * DAY, 'feedback@dhl.com', 'DHL Express',
        'How did we do?',
        'Rate your recent delivery. The survey takes less than a minute and helps us improve.',
        { trashedAgo: 7 * DAY }),

    inbox('e273', 11 * DAY, 'deals@aliexpress.com', 'AliExpress',
        'Last chance - 70% off everything',
        'Use code FINAL70 at checkout. Ends at midnight, and this time we mean it.',
        { trashedAgo: 10 * DAY, labels: ['spam'] }),

    inbox('e274', 13 * DAY, 'hello@frontendweekly.dev', 'Frontend Weekly',
        'Frontend Weekly #47',
        'This week: the state of CSS nesting, a long argument about signals, and someone rewrote grep again.',
        { isRead: false, trashedAgo: 12 * DAY }),

    inbox('e275', 15 * DAY, 'winner@prize-vault.info', 'Prize Vault',
        'You are our 1,000,000th visitor',
        'Claim your reward within the next ten minutes by confirming your details below.',
        { isRead: false, trashedAgo: 14 * DAY, labels: ['spam'] }),

    inbox('e276', 21 * DAY, 'hello@frontendweekly.dev', 'Frontend Weekly',
        'Weekly newsletter #48',
        'Five CSS features you are probably not using, an interview about state management, and the usual round-up.',
        { isRead: false, trashedAgo: 20 * DAY }),

    inbox('e277', 35 * DAY, 'promo@gym-central.com', 'Gym Central',
        'Bring a friend for free',
        'Any Sunday this month. Your friend gets a day pass and you get a smoothie, which is not an equal trade.',
        { trashedAgo: 33 * DAY }),

    inbox('e278', 60 * DAY, 'noreply@somesaas.com', 'SomeSaaS',
        'Your trial has ended',
        'Your workspace is now read-only. Upgrade within 30 days to keep your data.',
        { trashedAgo: 58 * DAY }),

    sent('e279', 80 * DAY, 'support@app-sus-verify.ru',
        'Re: URGENT: verify your account now',
        'Do not contact me again. Reported.',
        { trashedAgo: 79 * DAY, labels: ['spam'] }),

    inbox('e280', 200 * DAY, 'trials@oldtool.com', 'OldTool',
        'We are sorry to see you go',
        'Your account has been cancelled. Tell us why in one question and we will stop emailing you.',
        { trashedAgo: 190 * DAY }),

]
