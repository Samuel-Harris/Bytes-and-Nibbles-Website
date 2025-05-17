import React from "react";
import { Metadata } from "next";
import { METADATA_DESCRIPTION_CREDITS, WEBSITE_NAME } from "./common/constants";
import Header, { Tab } from "./Header";
import { theme } from "./common/theme";
import { default as HT } from "./common/HighlightedText";

export const metadata: Metadata = {
  title: WEBSITE_NAME,
  description: `A blog about two of my favourite hobbies: coding and cooking. ${METADATA_DESCRIPTION_CREDITS}`,
};

// Highlighted Text
const HL: React.FC<{ href: string; children: string }> = ({
  href,
  children,
}) => (
  <a href={href} title={children}>
    <HT>{children}</HT>
  </a>
);

const Home = (): JSX.Element => (
  <Header tab={Tab.Home}>
    <div className="grid md:grid-cols-3 justify-self-center my-2 sm:my-4 md:my-7 w-10/12">
      <div className="mr-4 mb-8">
        <img
          className="justify-self-center w-fit"
          src="homepage_photomosaic.jpg"
          alt="A photomosaic of the author of this website, Sam Harris."
        />
        <p className={theme.colours.tertiary.text}>
          A <HT>photomosaic</HT> of the author of this website,{" "}
          <HT>Sam Harris</HT>, that was made using an{" "}
          <HT>AI photomosaic generator</HT> that he made. This photomosaic was
          made using <HT>215,988</HT> images from{" "}
          <HL href="https://www.kaggle.com">Kaggle</HL> and{" "}
          <HL href="https://unsample.net">unsample</HL>. The source code for the
          photomosaic generator can be found{" "}
          <HL href="https://github.com/Samuel-Harris/photomosaic_generator">
            here
          </HL>
          .
        </p>
      </div>
      <div className="md:col-span-2">
        <div className="mb-8 space-y-2">
          <p className={`text-2xl ${theme.colours.tertiary.text}`}>
            What is this?
          </p>
          <p>
            In <HT>October 2023</HT>, I decided that I wanted to do more{" "}
            <HT>AI</HT> projects in my spare time. I thought that a great way to
            encourage myself to do this would be to start a <HT>tech blog</HT>.
            With the ego of a software engineer, I couldn&apos;t just use a
            pre-made site template like{" "}
            <HL href="https://wordpress.com">WordPress</HL> or write for a blog
            host, like{" "}
            <HL href="https://towardsdatascience.com">towards data science</HL>.
            I had to make my own.
          </p>
          <p>
            One night, I was cooking and was looking at a recipe on my phone,
            thinking,{" "}
            <HT>
              &quot;This recipe website sucks. If only I had my favourite
              recipes in a repository with standardised formatting...&quot;
            </HT>
            . So I added recipes to the site, bringing two of my favourite
            hobbies, <HT>cooking</HT> and <HT>coding</HT>, into one website.
          </p>
          <p>
            This website was finally completed in <HT>April 2024</HT>, and
            whether you came for the <HL href="/bytes">bytes</HL> (tech blogs)
            or the <HL href="/nibbles">nibbles</HL> (recipes), I hope you like
            it.
          </p>
        </div>
        <div className="space-y-2">
          <p className={`text-2xl ${theme.colours.tertiary.text}`}>Who am I?</p>
          <p>
            As you might have guessed from the header at the top of this page,
            my name is <HT>Sam</HT>! I am a professional{" "}
            <HT>software engineer</HT> who started learning to regularly code
            for fun in my spare time in <HT>2012</HT>. Since then, I have
            continued to code in my spare time, attended many{" "}
            <HT>hackathons</HT>, completed an <HT>MSci</HT> in{" "}
            <HT>computer science</HT> at the <HT>University of St Andrews</HT>,
            and have been working as a <HT>full-time software engineer</HT>{" "}
            since <HT>2023</HT>. I still enjoy programming as a hobby today and
            have a particular interest in <HT>Natural Language Processing</HT>.
          </p>
          <p>
            So <HT>join me</HT> as I make bespoke solutions to my life&apos;s
            problems and walk you through my experiences learning about what
            interests me in <HT>software engineering</HT> and{" "}
            <HT>machine learning</HT> while also providing you with a range of{" "}
            <HT>recipes</HT> from a plethora of cuisines that will suit any
            palate.
          </p>
        </div>
      </div>
    </div>
  </Header>
);
export default Home;
