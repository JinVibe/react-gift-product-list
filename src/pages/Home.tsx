import { Layout } from "@/Components/layout/Layout";
import CategorySection from "@/Components/CategorySection";
import GiftFriendsSection from "@/Components/GiftFriendsSection";
import KakaocampCheerSection from "@/Components/KakaocampCheerSection";
import RankingSection from "@/Components/RankingSection";
import ThemeSection from "@/Components/ThemeSection";

const Home = () => {
  return (
    <Layout>
      <GiftFriendsSection />
      <CategorySection />
      <ThemeSection />
      <KakaocampCheerSection />
      <RankingSection />
    </Layout>
  );
};

export default Home;
