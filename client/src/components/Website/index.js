import React, { useState, useEffect, useContext } from "react";
import Moment from "react-moment";
import c from "classnames";

import Indicator from "../Indicator";
import { appContext } from "../App";
import api from "../../api.js";

import style from "./style.module.css";

export default ({ website, extended, onClick }) => {
    const [uptime, setUptime] = useState(0);
    const [stats, setStats] = useState(null);
    const { period } = useContext(appContext);

    useEffect(() => {
        api.uptime(website.id, ...period).then(setUptime);
        api.aggregate(website.id, ...period).then(setStats);
    }, [website.id]);

    return (
        <div className={style.website} onClick={onClick}>
            <div className={style.segment}>
                <Indicator status={website.status} />
            </div>
            <div className={c(style.segment, style.name)}>
                {website.url}
                <small className={style.label}>
                    <Moment date={website.updatedAt} fromNow />
                </small>
            </div>
            {extended ? (
                <>
                    <div className={c(style.segment, style.spaced, style.extended)}>
                        <small className={style.label}>Checks</small>
                        {stats ? stats.count : "0"}
                    </div>
                    <div className={c(style.segment, style.spaced)}>
                        <small className={style.label}>Average</small>
                        {stats ? (stats.average / 1000).toFixed(2) : "0.00"}s
                    </div>
                    <div className={c(style.segment, style.spaced, style.extended)}>
                        <small className={style.label}>Lowest</small>
                        {stats ? (stats.lowest / 1000).toFixed(2) : "0.00"}s
                    </div>
                    <div className={c(style.segment, style.spaced, style.extended)}>
                        <small className={style.label}>Highest</small>
                        {stats ? (stats.highest / 1000).toFixed(2) : "0.00"}s
                    </div>
                    <div className={c(style.segment, style.spaced)}>
                        <small className={style.label}>Uptime</small>
                        {uptime % 1 > 0 ? uptime.toFixed(4) : uptime}%
                    </div>
                </>
            ) : (
                <div className={style.segment}>{uptime % 1 > 0 ? uptime.toFixed(4) : uptime}%</div>
            )}
        </div>
    );
};
