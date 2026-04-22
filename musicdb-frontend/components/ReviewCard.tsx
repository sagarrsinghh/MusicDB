import RatingStars from './RatingStars';

interface ReviewCardProps {
    user: string;
    rating: number;
    comment: string;
    date: string;
}

export default function ReviewCard({ user, rating, comment, date }: ReviewCardProps) {
    return (
        <div className="border p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">{user}</span>
                <span className="text-sm text-gray-500">{date}</span>
            </div>
            <RatingStars rating={rating} />
            <p className="mt-2 text-gray-700">{comment}</p>
        </div>
    );
}
